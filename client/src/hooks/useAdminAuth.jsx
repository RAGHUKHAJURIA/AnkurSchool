import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';

/**
 * Custom hook for admin authentication
 * This hook provides comprehensive admin authentication functionality
 * including role verification, token management, and admin status checking
 */
export const useAdminAuth = () => {
    const { user, isLoaded: userLoaded } = useUser();
    const { getToken, isSignedIn } = useAuth();

    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [adminUser, setAdminUser] = useState(null);
    const [error, setError] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    // Check admin status
    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!userLoaded) {
                setIsLoading(true);
                return;
            }

            if (!isSignedIn || !user) {
                setIsAdmin(false);
                setAdminUser(null);
                setIsLoading(false);
                return;
            }

            try {
                // Check admin status using the test endpoint (no auth required)
                const response = await axios.post(`https://ankurschool-v6d0.onrender.com/api/test/check-admin-status`, {
                    clerkUserId: user.id
                });

                if (response.data.success && response.data.isAdmin) {
                    setIsAdmin(true);
                    setAdminUser({
                        id: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        name: user.fullName,
                        role: 'admin',
                        dbId: response.data.user.id
                    });
                    setError(null);
                } else {
                    setIsAdmin(false);
                    setAdminUser(null);
                    setError('Access denied: Admin privileges required');
                }
            } catch (error) {
                console.error('Admin authentication error:', error);
                setIsAdmin(false);
                setAdminUser(null);
                setError('Failed to verify admin status');
            } finally {
                setIsLoading(false);
            }
        };

        checkAdminStatus();
    }, [userLoaded, isSignedIn, user, getToken, backendUrl]);

    // Get authenticated request headers
    const getAuthHeaders = async () => {
        try {
            const token = await getToken();
            console.log('🔑 Retrieved token:', token ? 'Present' : 'Missing');
            console.log('🔑 Token length:', token ? token.length : 0);
            console.log('🔑 Token preview:', token ? token.substring(0, 50) + '...' : 'No token');

            if (!token) {
                throw new Error('No token received from Clerk');
            }

            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
        } catch (error) {
            console.error('❌ Error getting auth headers:', error);
            throw new Error('Failed to get authentication token');
        }
    };

    // Make authenticated admin request
    const makeAdminRequest = async (url, options = {}) => {
        try {
            console.log('🚀 Making admin request to:', `${backendUrl}${url}`);
            const headers = await getAuthHeaders();
            console.log('📋 Request headers:', headers);

            const response = await axios({
                url: `https://ankurschool-v6d0.onrender.com${url}`,
                headers,
                ...options
            });

            console.log('✅ Admin request successful:', response.status);
            return response;
        } catch (error) {
            console.error('❌ Admin request error:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);

            // Handle authentication errors
            if (error.response?.status === 401) {
                setError('Session expired. Please sign in again.');
                setIsAdmin(false);
                setAdminUser(null);
            } else if (error.response?.status === 403) {
                setError('Access denied: Admin privileges required');
                setIsAdmin(false);
                setAdminUser(null);
            }

            throw error;
        }
    };

    // Refresh admin status
    const refreshAdminStatus = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = await getToken();

            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await axios.get(`https://ankurschool-v6d0.onrender.com/api/admin/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setIsAdmin(true);
                setAdminUser({
                    id: user.id,
                    email: user.primaryEmailAddress?.emailAddress,
                    name: user.fullName,
                    role: 'admin'
                });
                setError(null);
            } else {
                setIsAdmin(false);
                setAdminUser(null);
            }
        } catch (error) {
            console.error('Admin status refresh error:', error);
            setIsAdmin(false);
            setAdminUser(null);

            if (error.response?.status === 403 || error.response?.status === 401) {
                setError('Access denied: Admin privileges required');
            } else {
                setError('Failed to verify admin status');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isAdmin,
        isLoading,
        adminUser,
        error,
        isSignedIn,
        user,
        getAuthHeaders,
        makeAdminRequest,
        refreshAdminStatus
    };
};

/**
 * Higher-order component for admin route protection
 * This HOC wraps components that require admin access
 */
export const withAdminAuth = (WrappedComponent) => {
    return function AdminProtectedComponent(props) {
        const { isAdmin, isLoading, error } = useAdminAuth();

        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-900">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-white">Verifying admin access...</p>
                    </div>
                </div>
            );
        }

        if (!isAdmin) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-900">
                    <div className="text-center max-w-md mx-auto p-8">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
                        <p className="text-gray-300 mb-6">
                            {error || 'You do not have admin privileges to access this page.'}
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
};

/**
 * Hook for checking if user has specific admin permissions
 * This can be extended to support granular permissions
 */
export const useAdminPermissions = () => {
    const { isAdmin, adminUser } = useAdminAuth();

    const hasPermission = (permission) => {
        if (!isAdmin) return false;

        // For now, all admins have all permissions
        // This can be extended to support granular permissions
        const adminPermissions = [
            'view_dashboard',
            'manage_students',
            'manage_requests',
            'manage_payments',
            'manage_content',
            'view_analytics',
            'system_settings'
        ];

        return adminPermissions.includes(permission);
    };

    return {
        hasPermission,
        isAdmin,
        adminUser
    };
};
