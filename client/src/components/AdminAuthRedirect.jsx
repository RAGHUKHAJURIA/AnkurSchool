import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';

/**
 * Unified Admin Authentication and Redirect Component
 * Features:
 * - Automatically redirects admin users to /admin dashboard after login
 * - Redirects non-admin users away from admin routes
 * - Shows loading state during authentication checks
 * - Handles sign-out gracefully
 * - Single source of truth for admin redirect logic
 */
const AdminAuthRedirect = ({ children }) => {
    const { isSignedIn, user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);
    const [isAdmin, setIsAdmin] = useState(null);

    // Get backend URL from environment
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://ankurschool-v6d0.onrender.com';

    useEffect(() => {
        const checkAdminAndRedirect = async () => {
            // Wait for Clerk to load
            if (!isLoaded) {
                return;
            }

            // If not signed in, handle admin route protection
            if (!isSignedIn) {
                // Clear cached admin status (cleanup all admin status entries)
                Object.keys(sessionStorage).forEach(key => {
                    if (key.startsWith('adminStatus')) {
                        sessionStorage.removeItem(key);
                    }
                });
                setIsAdmin(null);

                if (location.pathname.startsWith('/admin')) {
                    console.log('Not signed in, redirecting from admin routes...');
                    navigate('/', { replace: true });
                }
                setIsChecking(false);
                setHasChecked(true);
                return;
            }

            // If user is signed in, check admin status
            if (isSignedIn && user) {
                const isOnAdminRoute = location.pathname.startsWith('/admin');
                const userId = user.id;
                const cachedStatus = sessionStorage.getItem(`adminStatus_${userId}`);
                const cacheTimestamp = sessionStorage.getItem(`adminStatusTime_${userId}`);
                const cacheAge = cacheTimestamp ? Date.now() - parseInt(cacheTimestamp) : Infinity;
                const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

                // Use cached status if available and not expired
                if (cachedStatus && cacheAge < CACHE_DURATION) {
                    const cachedIsAdmin = cachedStatus === 'true';
                    setIsAdmin(cachedIsAdmin);
                    setHasChecked(true);
                    setIsChecking(false);

                    // Handle redirects based on cached status
                    if (cachedIsAdmin) {
                        // Auto-redirect admin to /admin if not already there (only on first check)
                        if (!isOnAdminRoute && !hasChecked) {
                            console.log('Auto-redirecting admin to dashboard...');
                            navigate('/admin', { replace: true });
                        }
                    } else if (isOnAdminRoute) {
                        // Non-admin trying to access admin routes
                        console.log('Non-admin user, redirecting from admin routes...');
                        navigate('/', { replace: true });
                    }
                    return;
                }

                // Need to check admin status
                try {
                    setIsChecking(true);

                    // Get the session token using useAuth hook
                    const token = await getToken();

                    // Call backend to check admin role
                    const response = await fetch(`${backendUrl}/api/auth/check-admin`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await response.json();

                    if (data.success && data.isAdmin) {
                        console.log('Admin user detected:', data.user);
                        setIsAdmin(true);

                        // Cache the admin status
                        sessionStorage.setItem(`adminStatus_${userId}`, 'true');
                        sessionStorage.setItem(`adminStatusTime_${userId}`, Date.now().toString());

                        // Auto-redirect admin to /admin if not already there (only on initial login)
                        if (!isOnAdminRoute && !hasChecked) {
                            console.log('Auto-redirecting admin to dashboard...');
                            navigate('/admin', { replace: true });
                        }
                    } else {
                        // User is not admin
                        setIsAdmin(false);

                        // Cache the non-admin status
                        sessionStorage.setItem(`adminStatus_${userId}`, 'false');
                        sessionStorage.setItem(`adminStatusTime_${userId}`, Date.now().toString());

                        // If trying to access admin routes, redirect to home
                        if (isOnAdminRoute) {
                            console.log('Non-admin user, redirecting from admin routes...');
                            navigate('/', { replace: true });
                        }
                    }

                    setHasChecked(true);
                } catch (error) {
                    console.error('Error checking admin status:', error);

                    // On error, don't cache - treat as unknown
                    setIsAdmin(null);

                    // If error and trying to access admin routes, redirect to home for safety
                    if (isOnAdminRoute) {
                        navigate('/', { replace: true });
                    }
                    setHasChecked(true);
                } finally {
                    setIsChecking(false);
                }
            }
        };

        checkAdminAndRedirect();
    }, [isSignedIn, isLoaded, user, getToken, navigate, location.pathname, hasChecked, backendUrl]);

    // Reset hasChecked when sign-in state changes
    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            setHasChecked(false);
            setIsAdmin(null);
            // Clear all cached admin statuses
            Object.keys(sessionStorage).forEach(key => {
                if (key.startsWith('adminStatus')) {
                    sessionStorage.removeItem(key);
                }
            });
        }
    }, [isSignedIn, isLoaded]);

    // Show loading state only during actual checking (not on cached loads)
    if (isChecking && isLoaded && isSignedIn) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
                        <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-blue-300 border-t-transparent animate-ping opacity-20 mx-auto"></div>
                    </div>
                    <p className="text-gray-300 text-lg font-medium">Checking authentication...</p>
                    <p className="text-gray-500 text-sm mt-2">Please wait</p>
                </div>
            </div>
        );
    }

    return children;
};

export default AdminAuthRedirect;

