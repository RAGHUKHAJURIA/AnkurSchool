import express from 'express';
import multer from 'multer';
import { uploadToGridFS, downloadFromGridFS, getFileInfo, listFiles } from '../config/gridfs.js';
import User from '../models/user.js';
import { clerkClient } from '@clerk/express';

const testRouter = express.Router();

// Configure multer for testing
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Test file upload
testRouter.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const fileData = await uploadToGridFS(req.file, {
            test: true,
            uploadedAt: new Date()
        });

        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                fileId: fileData.id,
                filename: fileData.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        });

    } catch (error) {
        console.error('Upload test error:', error);
        res.status(500).json({
            success: false,
            message: 'Upload failed',
            error: error.message
        });
    }
});

// Test file download
testRouter.get('/download/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;

        const fileInfo = await getFileInfo(fileId);
        if (!fileInfo) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        const fileBuffer = await downloadFromGridFS(fileId);

        res.set({
            'Content-Type': fileInfo.metadata?.mimetype || 'application/octet-stream',
            'Content-Disposition': `inline; filename="${fileInfo.filename}"`,
            'Content-Length': fileInfo.length
        });

        res.send(fileBuffer);

    } catch (error) {
        console.error('Download test error:', error);
        res.status(500).json({
            success: false,
            message: 'Download failed',
            error: error.message
        });
    }
});

// Test list files
testRouter.get('/list', async (req, res) => {
    try {
        const files = await listFiles();

        const fileList = files.map(file => ({
            fileId: file._id,
            filename: file.filename,
            originalName: file.metadata?.originalName,
            mimetype: file.metadata?.mimetype,
            size: file.length,
            uploadDate: file.uploadDate
        }));

        res.json({
            success: true,
            count: fileList.length,
            data: fileList
        });

    } catch (error) {
        console.error('List files test error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to list files',
            error: error.message
        });
    }
});

// Test file info retrieval
testRouter.get('/file-info/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        console.log('Testing file info for:', fileId);
        const fileInfo = await getFileInfo(fileId);
        console.log('File info result:', fileInfo);

        res.json({
            success: true,
            message: 'File info retrieved successfully',
            data: fileInfo
        });
    } catch (error) {
        console.error('File info test error:', error);
        res.status(500).json({
            success: false,
            message: 'File info test failed',
            error: error.message
        });
    }
});

// Test GridFS status
testRouter.get('/status', (req, res) => {
    res.json({
        success: true,
        message: 'GridFS test endpoints are working',
        endpoints: [
            'POST /api/test/upload - Upload a file',
            'GET /api/test/download/:fileId - Download a file',
            'GET /api/test/list - List all files',
            'GET /api/test/file-info/:fileId - Get file info',
            'GET /api/test/status - This status endpoint'
        ]
    });
});

// Test content creation with gallery items
testRouter.post('/test-gallery', async (req, res) => {
    try {
        console.log('=== TEST GALLERY CREATION ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        console.log('Gallery items:', req.body.galleryItems);
        console.log('Gallery items type:', typeof req.body.galleryItems);
        console.log('Gallery items is array:', Array.isArray(req.body.galleryItems));
        console.log('=============================');

        res.json({
            success: true,
            message: 'Test gallery creation received',
            receivedData: req.body
        });
    } catch (error) {
        console.error('Test gallery error:', error);
        res.status(500).json({
            success: false,
            message: 'Test gallery failed',
            error: error.message
        });
    }
});

// Test payment integration
testRouter.get('/payment-status', (req, res) => {
    res.json({
        success: true,
        message: 'Payment integration test endpoint',
        phonepeConfigured: !!(process.env.PHONEPE_MERCHANT_ID && process.env.PHONEPE_SALT_KEY),
        endpoints: [
            'POST /api/payments/initiate - Initiate payment',
            'GET /api/payments/verify/:merchantTransactionId - Verify payment',
            'POST /api/payments/phonepe-callback - PhonePe webhook',
            'GET /api/payments/status/:paymentId - Get payment status',
            'GET /api/payments/all - Get all payments (Admin)'
        ],
        environment: {
            NODE_ENV: process.env.NODE_ENV,
            PHONEPE_MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID ? 'Configured' : 'Not configured',
            PHONEPE_SALT_KEY: process.env.PHONEPE_SALT_KEY ? 'Configured' : 'Not configured',
            SERVER_URL: process.env.SERVER_URL,
            CLIENT_URL: process.env.CLIENT_URL
        }
    });
});

// Test user management endpoints
testRouter.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-__v');

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get users',
            error: error.message
        });
    }
});

// Update user role endpoint
testRouter.put('/users/:userId/role', async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!role || !['student', 'parent', 'teacher', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be one of: student, parent, teacher, admin'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User role updated successfully',
            data: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user role',
            error: error.message
        });
    }
});

// Create or update user from Clerk ID
testRouter.post('/users/sync-clerk', async (req, res) => {
    try {
        const { clerkUserId, email, name, role = 'student' } = req.body;

        if (!clerkUserId || !email) {
            return res.status(400).json({
                success: false,
                message: 'clerkUserId and email are required'
            });
        }

        // Check if user exists
        let user = await User.findOne({ externalId: clerkUserId });

        if (user) {
            // Update existing user
            user.email = email;
            user.name = name || user.name;
            user.role = role;
            await user.save();
        } else {
            // Create new user
            user = new User({
                externalId: clerkUserId,
                email,
                name: name || email.split('@')[0],
                role
            });
            await user.save();
        }

        res.json({
            success: true,
            message: 'User synced successfully',
            data: {
                id: user._id,
                externalId: user.externalId,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Sync user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to sync user',
            error: error.message
        });
    }
});

// Check admin status endpoint (no admin auth required)
testRouter.post('/check-admin-status', async (req, res) => {
    try {
        const { clerkUserId } = req.body;

        if (!clerkUserId) {
            return res.status(400).json({
                success: false,
                message: 'clerkUserId is required'
            });
        }

        // Find user in database
        const user = await User.findOne({ externalId: clerkUserId });

        if (!user) {
            return res.json({
                success: true,
                isAdmin: false,
                message: 'User not found in database'
            });
        }

        const isAdmin = user.role === 'admin';

        res.json({
            success: true,
            isAdmin,
            user: {
                id: user._id,
                externalId: user.externalId,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Check admin status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check admin status',
            error: error.message
        });
    }
});

// Test file serving
testRouter.get('/serve-file/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        console.log("Test file serving for:", fileId);

        // Import the getFile function
        const { getFile } = await import('../controller/fileController.js');

        // Call the getFile function
        await getFile(req, res);

    } catch (error) {
        console.error('Test file serving error:', error);
        res.status(500).json({
            success: false,
            message: 'Test file serving failed',
            error: error.message
        });
    }
});

// Debug admin authentication
testRouter.post('/debug-admin-auth', async (req, res) => {
    try {
        const { sessionToken, clerkUserId } = req.body;

        const debugInfo = {
            timestamp: new Date().toISOString(),
            hasSessionToken: !!sessionToken,
            hasClerkUserId: !!clerkUserId,
            clerkSecretKey: !!process.env.CLERK_SECRET_KEY,
            environment: process.env.NODE_ENV || 'development'
        };

        // Try to decode token
        if (sessionToken) {
            try {
                const tokenParts = sessionToken.split('.');
                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    debugInfo.tokenPayload = {
                        sub: payload.sub,
                        user_id: payload.user_id,
                        id: payload.id,
                        userId: payload.userId,
                        exp: payload.exp,
                        iat: payload.iat
                    };
                }
            } catch (e) {
                debugInfo.tokenDecodeError = e.message;
            }
        }

        // Try to verify with Clerk
        if (sessionToken && process.env.CLERK_SECRET_KEY) {
            try {
                const session = await clerkClient.sessions.verifySession(sessionToken, {
                    secretKey: process.env.CLERK_SECRET_KEY
                });
                debugInfo.clerkSession = {
                    userId: session.userId,
                    status: session.status,
                    expireAt: session.expireAt
                };
            } catch (e) {
                debugInfo.clerkVerificationError = e.message;
            }
        }

        // Check database users
        const allUsers = await User.find({}, 'externalId email name role createdAt').limit(10);
        debugInfo.databaseUsers = allUsers.map(user => ({
            id: user._id,
            externalId: user.externalId,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt
        }));

        // Check specific user if provided
        if (clerkUserId) {
            const specificUser = await User.findOne({ externalId: clerkUserId });
            debugInfo.specificUser = specificUser ? {
                id: specificUser._id,
                externalId: specificUser.externalId,
                email: specificUser.email,
                name: specificUser.name,
                role: specificUser.role
            } : null;
        }

        res.json({
            success: true,
            message: 'Debug information collected',
            debug: debugInfo
        });

    } catch (error) {
        console.error('Debug admin auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Debug failed',
            error: error.message
        });
    }
});

export default testRouter;