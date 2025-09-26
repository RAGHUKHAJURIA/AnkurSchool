import express from 'express';
import {
    initiatePayment,
    verifyPayment,
    phonepeCallback,
    getPaymentStatus,
    getAllPayments
} from '../controller/paymentController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const paymentRouter = express.Router();

// Test endpoint to check configuration
paymentRouter.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Payment API is working',
        config: {
            merchantId: process.env.PHONEPE_MERCHANT_ID ? 'Set' : 'Not Set',
            saltKey: process.env.PHONEPE_SALT_KEY ? 'Set' : 'Not Set',
            saltIndex: process.env.PHONEPE_SALT_INDEX || 'Not Set',
            baseUrl: process.env.NODE_ENV === 'production'
                ? 'https://api.phonepe.com/apis/hermes'
                : 'https://api-preprod.phonepe.com/apis/hermes'
        }
    });
});

// Public payment routes (for students)
paymentRouter.post('/initiate', initiatePayment);
paymentRouter.get('/verify/:merchantTransactionId', verifyPayment);
paymentRouter.post('/phonepe-callback', phonepeCallback);
paymentRouter.get('/status/:paymentId', getPaymentStatus);

// Admin-only payment routes (strictly protected)
paymentRouter.get('/all', requireAdminAuth, getAllPayments);

export default paymentRouter;
