import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Shield, User, Mail, Key, CheckCircle, AlertCircle } from 'lucide-react';

const CreateAdminUser = () => {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        email: user?.primaryEmailAddress?.emailAddress || '',
        name: user?.fullName || '',
        role: 'admin'
    });

    const backendUrl = 'https://ankurschool-v6d0.onrender.com'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await axios.post(`https://ankurschool-v6d0.onrender.com/api/test/users/sync-clerk`, {
                clerkUserId: user?.id,
                email: formData.email,
                name: formData.name,
                role: formData.role
            });

            if (response.data.success) {
                setMessage({
                    type: 'success',
                    text: 'Admin user created successfully! You can now access admin routes.'
                });
            } else {
                setMessage({
                    type: 'error',
                    text: response.data.message || 'Failed to create admin user'
                });
            }
        } catch (error) {
            console.error('Error creating admin user:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to create admin user'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
                    <p className="text-gray-300">Please sign in to create an admin user.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Admin User</h1>
                            <p className="text-slate-600">Set up your admin account to access the admin panel</p>
                        </div>

                        {/* Current User Info */}
                        <div className="bg-blue-50 rounded-xl p-6 mb-8">
                            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                Current Clerk User
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <Key className="w-4 h-4 text-blue-600 mr-2" />
                                    <span className="text-sm text-blue-800">ID: {user.id}</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="w-4 h-4 text-blue-600 mr-2" />
                                    <span className="text-sm text-blue-800">Email: {user.primaryEmailAddress?.emailAddress}</span>
                                </div>
                            </div>
                        </div>

                        {/* Message Display */}
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                                ? 'bg-green-50 border border-green-200 text-green-800'
                                : 'bg-red-50 border border-red-200 text-red-800'
                                }`}>
                                {message.type === 'success' ? (
                                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
                                )}
                                <span className="font-medium">{message.text}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-800 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-800 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-800 mb-2">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="parent">Parent</option>
                                    <option value="student">Student</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Creating User...
                                    </>
                                ) : (
                                    <>
                                        <Shield className="w-5 h-5" />
                                        Create Admin User
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Instructions */}
                        <div className="mt-8 p-6 bg-slate-50 rounded-xl">
                            <h3 className="text-lg font-semibold text-slate-900 mb-3">Instructions</h3>
                            <ol className="space-y-2 text-sm text-slate-700">
                                <li className="flex items-start">
                                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                                    Fill in your email and name (pre-filled from Clerk)
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                                    Select "Admin" as your role
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                                    Click "Create Admin User" to sync with database
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                                    Once created, you can access admin routes
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAdminUser;


