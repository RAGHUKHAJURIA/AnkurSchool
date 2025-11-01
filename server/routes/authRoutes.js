import express from 'express';
import { clerkClient } from '@clerk/express';
import User from '../models/user.js';

const router = express.Router();

/**
 * Check if current user is admin
 * GET /api/auth/check-admin
 */
router.get('/check-admin', async (req, res) => {
    try {
        // Get the session token
        const sessionToken = req.headers.authorization?.replace('Bearer ', '');

        if (!sessionToken) {
            return res.status(200).json({
                success: true,
                isAdmin: false,
                message: 'Not authenticated'
            });
        }

        // Decode JWT token to get user ID
        let clerkUserId = null;
        let userEmail = null;
        
        try {
            const tokenParts = sessionToken.split('.');
            if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                clerkUserId = payload.sub || payload.user_id || payload.id;
            }
        } catch (e) {
            return res.status(200).json({
                success: true,
                isAdmin: false,
                message: 'Invalid token'
            });
        }

        if (!clerkUserId) {
            return res.status(200).json({
                success: true,
                isAdmin: false,
                message: 'Could not identify user'
            });
        }

        // Get user email from Clerk first (primary method)
        if (process.env.CLERK_SECRET_KEY) {
            try {
                const clerkUser = await clerkClient.users.getUser(clerkUserId);
                if (clerkUser && clerkUser.emailAddresses && clerkUser.emailAddresses.length > 0) {
                    userEmail = clerkUser.emailAddresses[0].emailAddress.toLowerCase();
                }
            } catch (e) {
                console.error('Error fetching Clerk user:', e);
            }
        }

        // PRIMARY CHECK: Check by email if we have it (most reliable)
        if (userEmail) {
            const userByEmail = await User.findOne({ email: userEmail.toLowerCase() });
            if (userByEmail && userByEmail.role === 'admin') {
                return res.status(200).json({
                    success: true,
                    isAdmin: true,
                    user: {
                        email: userByEmail.email,
                        name: userByEmail.name,
                        role: userByEmail.role
                    }
                });
            }
        }

        // FALLBACK: Check by externalId
        const dbUser = await User.findOne({ externalId: clerkUserId });
        if (dbUser && dbUser.role === 'admin') {
            return res.status(200).json({
                success: true,
                isAdmin: true,
                user: {
                    email: dbUser.email,
                    name: dbUser.name,
                    role: dbUser.role
                }
            });
        }

        // User is not admin
        return res.status(200).json({
            success: true,
            isAdmin: false,
            message: 'User is not an admin'
        });

    } catch (error) {
        console.error('Error checking admin status:', error);
        return res.status(500).json({
            success: false,
            isAdmin: false,
            message: 'Server error',
            error: error.message
        });
    }
});

/**
 * Get current user info
 * GET /api/auth/me
 */
router.get('/me', async (req, res) => {
    try {
        const sessionToken = req.headers.authorization?.replace('Bearer ', '');

        if (!sessionToken) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        let clerkUserId = null;
        try {
            const tokenParts = sessionToken.split('.');
            if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                clerkUserId = payload.sub || payload.user_id || payload.id;
            }
        } catch (e) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        const dbUser = await User.findOne({ externalId: clerkUserId });

        if (!dbUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: dbUser._id,
                email: dbUser.email,
                name: dbUser.name,
                role: dbUser.role,
                externalId: dbUser.externalId
            }
        });

    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

export default router;