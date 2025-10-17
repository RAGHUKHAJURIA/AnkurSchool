import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import studentRouter from './routes/studentRoutes.js';
import contentRouter from './routes/contentRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
import fileRouter from './routes/fileRoutes.js';
import testRouter from './routes/testRoutes.js';
import admissionRouter from './routes/admissionRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import adminMessageRouter from './routes/adminMessageRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import { clerkWebhooks } from './controller/webhooks.js';
import {
  requireAdminAuth,
  adminRateLimit,
  adminSecurityHeaders,
  adminAccessLogger
} from './middleware/authMiddleware.js';

// Load environment variables
dotenv.config();



const app = express();

app.post("/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

app.use('/api/files', fileRouter);

// --- Clerk webhook BEFORE body parsing middleware ---


// --- Core middleware ---
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// --- Base route ---
app.get('/', (req, res) => {
  res.send('Server is running successfully ✅');
});

// --- Main routes ---
app.use('/api/students', studentRouter);
app.use('/api/payments', paymentRouter);

app.use('/api/test', testRouter);
app.use('/api/admission', admissionRouter);

// Public message route (contact form)
app.use('/api/messages', messageRouter);

// --- Admin-protected routes ---
app.use(
  '/api/admin',
  adminRateLimit,
  adminSecurityHeaders,
  adminAccessLogger,
  requireAdminAuth,
  adminRouter
);

app.use(
  '/api/admin/messages',
  adminRateLimit,
  adminSecurityHeaders,
  adminAccessLogger,
  requireAdminAuth,
  adminMessageRouter
);

// --- Conditional Clerk middleware for content routes ---
const contentAuth = process.env.CLERK_SECRET_KEY
  ? clerkMiddleware()
  : (req, res, next) => next();

app.use('/api/content', contentAuth, contentRouter);

// --- Error handling middleware ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// --- Database connection & server start ---
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
