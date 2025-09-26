import { useState, useEffect, useContext } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { AppContext } from '../context/AppContext.jsx';

/**
 * Simple Admin Authentication Hook using AppContext
 * This hook provides admin authentication functionality using the existing AppContext
 */
export const useAdminAuthSimple = () => {
    const { getToken, backendUrl } = useContext(AppContext);
    const { user, isLoaded: userLoaded } = useUser();

    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [adminUser, setAdminUser] = useState(null);
    const [error, setError] = useState(null);

    // Check admin status
    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!userLoaded) {
                setIsLoading(true);
                return;
            }

            if (!user) {
                setIsAdmin(false);
                setAdminUser(null);
                setIsLoading(false);
                return;
            }

            try {
                // Check admin status using the test endpoint
                const response = await axios.post(`${backendUrl}/api/test/check-admin-status`, {
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
    }, [userLoaded, user, backendUrl]);

    // Make authenticated admin request
    const makeAdminRequest = async (method, url, options = {}) => {
        try {
            // Get the token from AppContext
            const token = await getToken();

            if (!token) {
                throw new Error('No authentication token available');
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers
            };

            const response = await axios({
                method,
                url: `${backendUrl}${url}`,
                headers,
                ...options
            });

            return response;
        } catch (error) {
            console.error('Admin request error:', error);

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

    return {
        isAdmin,
        isLoading,
        adminUser,
        error,
        makeAdminRequest
    };
};
