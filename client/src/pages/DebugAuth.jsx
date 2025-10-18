import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const DebugAuth = () => {
    const { user, isLoaded } = useUser();
    const [debugInfo, setDebugInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    const checkAdminStatus = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const response = await axios.post('https://ankurschool-v6d0.onrender.com/api/test/check-admin-status', {
                clerkUserId: user.id
            });

            setDebugInfo({
                clerkUser: {
                    id: user.id,
                    email: user.primaryEmailAddress?.emailAddress,
                    name: user.fullName
                },
                adminCheck: response.data
            });
        } catch (error) {
            setDebugInfo({
                clerkUser: {
                    id: user.id,
                    email: user.primaryEmailAddress?.emailAddress,
                    name: user.fullName
                },
                error: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            checkAdminStatus();
        }
    }, [isLoaded, user]);

    if (!isLoaded) {
        return <div className="p-8">Loading...</div>;
    }

    if (!user) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Debug Authentication</h1>
                <p className="text-red-600">You are not logged in. Please sign in first.</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Debug Authentication</h1>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Clerk User Info</h2>
                <div className="bg-gray-50 p-4 rounded">
                    <pre className="text-sm">
                        {JSON.stringify({
                            id: user.id,
                            email: user.primaryEmailAddress?.emailAddress,
                            name: user.fullName,
                            isLoaded
                        }, null, 2)}
                    </pre>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Admin Status Check</h2>
                <button
                    onClick={checkAdminStatus}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
                >
                    {loading ? 'Checking...' : 'Check Admin Status'}
                </button>

                {debugInfo && (
                    <div className="bg-gray-50 p-4 rounded">
                        <pre className="text-sm">
                            {JSON.stringify(debugInfo, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Database Users</h2>
                <button
                    onClick={async () => {
                        try {
                            const response = await axios.get('https://ankurschool-v6d0.onrender.com/api/test/users');
                            setDebugInfo(prev => ({
                                ...prev,
                                allUsers: response.data
                            }));
                        } catch (error) {
                            console.error('Error fetching users:', error);
                        }
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
                >
                    Get All Users
                </button>
            </div>
        </div>
    );
};

export default DebugAuth;
