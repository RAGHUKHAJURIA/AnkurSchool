import React, { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const TestAuth = () => {
    const { user } = useUser();
    const { getToken } = useAuth();
    const [token, setToken] = useState(null);
    const [testResult, setTestResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const getTokenTest = async () => {
        try {
            const token = await getToken();
            setToken(token);
            console.log('Token:', token);
        } catch (error) {
            console.error('Error getting token:', error);
        }
    };

    const testAdminRoute = async () => {
        if (!token) {
            alert('Please get token first');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/admin/students`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setTestResult({ success: true, data: response.data });
        } catch (error) {
            console.error('Admin route test error:', error);
            setTestResult({
                success: false,
                error: error.response?.data || error.message,
                status: error.response?.status
            });
        } finally {
            setLoading(false);
        }
    };

    const testAdminStatus = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/api/test/check-admin-status`, {
                clerkUserId: user?.id
            });
            setTestResult({ success: true, data: response.data });
        } catch (error) {
            console.error('Admin status test error:', error);
            setTestResult({
                success: false,
                error: error.response?.data || error.message,
                status: error.response?.status
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Authentication Test</h1>

                <div className="bg-slate-800 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">User Info</h2>
                    <div className="text-gray-300 space-y-2">
                        <p><strong>User ID:</strong> {user?.id}</p>
                        <p><strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}</p>
                        <p><strong>Name:</strong> {user?.fullName}</p>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Token Test</h2>
                    <button
                        onClick={getTokenTest}
                        className="bg-blue-600 text-white px-4 py-2 rounded mr-4"
                    >
                        Get Token
                    </button>
                    {token && (
                        <div className="mt-4">
                            <p className="text-gray-300 text-sm break-all">
                                <strong>Token:</strong> {token.substring(0, 50)}...
                            </p>
                        </div>
                    )}
                </div>

                <div className="bg-slate-800 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Route Tests</h2>
                    <div className="space-x-4">
                        <button
                            onClick={testAdminStatus}
                            disabled={loading}
                            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            Test Admin Status
                        </button>
                        <button
                            onClick={testAdminRoute}
                            disabled={loading || !token}
                            className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            Test Admin Route
                        </button>
                    </div>
                </div>

                {testResult && (
                    <div className="bg-slate-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Test Result</h2>
                        <pre className="text-gray-300 text-sm overflow-auto">
                            {JSON.stringify(testResult, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestAuth;
