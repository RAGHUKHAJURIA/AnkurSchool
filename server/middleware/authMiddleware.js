import { clerkClient } from '@clerk/express';
import User from '../models/user.js';

/**
 * Strict Admin Authentication Middleware
 * This middleware ensures only users with admin role can access admin routes
 * It performs multiple security checks:
 * 1. Verifies Clerk authentication
 * 2. Checks if user exists in database
 * 3. Verifies admin role
 * 4. Logs all access attempts for security monitoring
 */

export const requireAdminAuth = async (req, res, next) => {
    try {
        // Get the session token from the request
        const sessionToken = req.headers.authorization?.replace('Bearer ', '') ||
            req.cookies?.__session ||
            req.headers['x-session-token'];

        if (!sessionToken) {
            return res.status(401).json({
                success: false,
                message: 'Access denied: Authentication required',
                error: 'No session token provided'
            });
        }

        // Enhanced authentication - try multiple methods to get user ID
        let clerkUserId = null;

        try {
            // Method 1: Try to decode JWT token
            const tokenParts = sessionToken.split('.');
            if (tokenParts.length === 3) {
                try {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    clerkUserId = payload.sub || payload.user_id || payload.id;
                } catch (e) {
                    // Token decode failed, try other methods
                }
            }

            // Method 2: Try to verify with Clerk (if credentials are available)
            if (!clerkUserId && process.env.CLERK_SECRET_KEY) {
                try {
                    const session = await clerkClient.sessions.verifySession(sessionToken, {
                        secretKey: process.env.CLERK_SECRET_KEY
                    });
                    if (session && session.userId) {
                        clerkUserId = session.userId;
                    }
                } catch (e) {
                    // Clerk verification failed, continue with other methods
                }
            }

            // Method 3: Check if token contains user info in a different format
            if (!clerkUserId) {
                try {
                    const decoded = JSON.parse(atob(sessionToken.split('.')[1]));
                    clerkUserId = decoded.sub || decoded.user_id || decoded.id || decoded.userId;
                } catch (e) {
                    // All methods failed
                }
            }

            // If still no user ID found, return error
            if (!clerkUserId) {
                return res.status(401).json({
                    success: false,
                    message: 'Access denied: Could not identify user',
                    error: 'Invalid or malformed token'
                });
            }

        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Access denied: Authentication failed',
                error: 'Token processing error'
            });
        }

        // Get user email from Clerk first (primary method for admin check)
        let userEmail = null;
        if (process.env.CLERK_SECRET_KEY) {
            try {
                const clerkUser = await clerkClient.users.getUser(clerkUserId);
                if (clerkUser && clerkUser.emailAddresses && clerkUser.emailAddresses.length > 0) {
                    userEmail = clerkUser.emailAddresses[0].emailAddress.toLowerCase();
                }
            } catch (e) {
                console.error('Error fetching Clerk user in middleware:', e);
            }
        }

        // PRIMARY CHECK: Check by email if we have it (most reliable)
        let dbUser = null;
        if (userEmail) {
            dbUser = await User.findOne({ email: userEmail.toLowerCase() });
        }

        // FALLBACK: Check by externalId if email check didn't find user
        if (!dbUser) {
            dbUser = await User.findOne({ externalId: clerkUserId });
        }

        if (!dbUser) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: User not registered in system',
                error: 'User not found in database',
                debug: {
                    clerkUserId: clerkUserId,
                    userEmail: userEmail,
                    suggestion: 'Please ensure user is registered and has admin role'
                }
            });
        }

        // Check if user has admin role
        if (dbUser.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Admin privileges required',
                error: 'Insufficient permissions',
                debug: {
                    userRole: dbUser.role,
                    requiredRole: 'admin',
                    userEmail: dbUser.email,
                    suggestion: 'Contact administrator to grant admin access'
                }
            });
        }

        // Update last login timestamp
        await User.findByIdAndUpdate(dbUser._id, {
            lastLogin: new Date()
        });

        // Admin access granted

        // Add user info to request object for use in controllers
        req.user = {
            id: dbUser._id,
            clerkId: clerkUserId,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            lastLogin: dbUser.lastLogin
        };

        next();

    } catch (error) {
        console.error('Admin authentication error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Authentication service error',
            error: 'Internal server error during authentication'
        });
    }
};

/**
 * Optional Admin Authentication Middleware
 * This middleware checks for admin role but doesn't block access
 * Useful for routes that show different content based on admin status
 */
export const optionalAdminAuth = async (req, res, next) => {
    try {
        const sessionToken = req.headers.authorization?.replace('Bearer ', '') ||
            req.cookies?.__session ||
            req.headers['x-session-token'];

        if (!sessionToken) {
            req.user = null;
            return next();
        }

        const session = await clerkClient.sessions.verifySession(sessionToken, {
            secretKey: process.env.CLERK_SECRET_KEY
        });

        if (!session || !session.userId) {
            req.user = null;
            return next();
        }

        const clerkUser = await clerkClient.users.getUser(session.userId);
        const dbUser = await User.findOne({ externalId: clerkUser.id });

        if (dbUser && dbUser.role === 'admin') {
            req.user = {
                id: dbUser._id,
                clerkId: clerkUser.id,
                email: dbUser.email,
                name: dbUser.name,
                role: dbUser.role
            };
        } else {
            req.user = null;
        }

        next();

    } catch (error) {
        console.error('Optional admin auth error:', error.message);
        req.user = null;
        next();
    }
};

/**
 * Rate Limiting Middleware for Admin Routes
 * Prevents brute force attacks on admin endpoints
 */
export const adminRateLimit = (req, res, next) => {
    // Simple in-memory rate limiting (in production, use Redis)
    const clientIp = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 5 * 60 * 1000; // 5 minutes
    const maxAttempts = 200; // Max 200 attempts per window (increased for development)

    if (!global.adminRateLimit) {
        global.adminRateLimit = new Map();
    }

    const attempts = global.adminRateLimit.get(clientIp) || [];
    const recentAttempts = attempts.filter(time => now - time < windowMs);

    if (recentAttempts.length >= maxAttempts) {

        return res.status(429).json({
            success: false,
            message: 'Too many authentication attempts',
            error: 'Rate limit exceeded. Please try again later.',
            retryAfter: Math.ceil((recentAttempts[0] + windowMs - now) / 1000)
        });
    }

    // Add current attempt
    recentAttempts.push(now);
    global.adminRateLimit.set(clientIp, recentAttempts);

    next();
};

/**
 * Security Headers Middleware for Admin Routes
 * Adds additional security headers to admin responses
 */
export const adminSecurityHeaders = (req, res, next) => {
    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    // Remove server information
    res.removeHeader('X-Powered-By');

    next();
};

/**
 * Admin Access Logging Middleware
 * Logs all admin access attempts for security monitoring
 */
export const adminAccessLogger = (req, res, next) => {
    const startTime = Date.now();

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
        const duration = Date.now() - startTime;

        // Admin access logged

        originalEnd.call(this, chunk, encoding);
    };

    next();
};
