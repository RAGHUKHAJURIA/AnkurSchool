// // import express from 'express';
// // import cors from 'cors';
// // import dotenv from 'dotenv';
// // import connectDB from './config/mongodb.js';
// // import studentRouter from './routes/studentRoutes.js';
// // import contentRouter from './routes/contentRoutes.js';
// // import { clerkMiddleware } from '@clerk/express'
// // import { clerkWebhooks } from './controller/webhooks.js'

// // // Configure dotenv to load environment variables
// // dotenv.config();

// // const app = express();

// // app.post("/clerk", express.raw({ type: "application/json" }), clerkWebhooks);
// // // Middleware
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));
// // app.use(cors());

// // app.use(clerkMiddleware())

// // await connectDB();


// // app.get('/', (req, res) => {
// //   res.send("Home Route")
// // })

// // // Routes

// // app.use('/api/students', studentRouter);
// // app.use('/api/content', clerkMiddleware(), contentRouter);


// // const PORT = process.env.PORT || 5000

// // app.listen(PORT, () => {
// //   console.log(`Server is running on port ${PORT}`)
// // })






// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectDB from './config/mongodb.js';
// import studentRouter from './routes/studentRoutes.js';
// import contentRouter from './routes/contentRoutes.js';
// import { clerkMiddleware } from '@clerk/express';
// import { clerkWebhooks } from './controller/webhooks.js';

// dotenv.config();

// const app = express();

// // Webhook route BEFORE other middleware
// app.post("/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

// // Apply middleware in correct order
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use(clerkMiddleware()); // Apply globally BEFORE routes

// await connectDB();

// app.get('/', (req, res) => {
//   res.send("Home Route");
// });

// // Routes (Clerk middleware already applied globally)
// app.use('/api/students', studentRouter);
// app.use('/api/content', contentRouter); // Remove clerkMiddleware() here since it's global

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });






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

dotenv.config();

const app = express();

// Clerk webhook BEFORE json middleware
app.post("/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

// Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// In your server setup (e.g., app.js or server.js)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send("Home Route");
});
app.use('/api/students', studentRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/files', fileRouter);
app.use('/api/test', testRouter);
app.use('/api/admission', admissionRouter);
// Public message route (contact form)
app.use('/api/messages', messageRouter);
// Apply strict admin authentication to all admin routes
app.use('/api/admin',
  adminRateLimit,           // Rate limiting
  adminSecurityHeaders,     // Security headers
  adminAccessLogger,        // Access logging
  requireAdminAuth,         // Strict admin authentication
  adminRouter
);

// Admin message routes (protected)
app.use('/api/admin/messages',
  adminRateLimit,           // Rate limiting
  adminSecurityHeaders,     // Security headers
  adminAccessLogger,        // Access logging
  requireAdminAuth,         // Strict admin authentication
  adminMessageRouter
);

// Apply Clerk auth only if configured (avoids 500s in local dev)
const contentAuth = process.env.CLERK_SECRET_KEY ? clerkMiddleware() : (req, res, next) => {
  next();
};
app.use('/api/content', contentAuth, contentRouter);

// Connect to DB in all environments (Vercel serverless will reuse connections)
try {
  // Do not await here to avoid blocking cold start; mongoose handles queueing
  connectDB();
} catch (error) {
  console.error('Failed to initiate MongoDB connection:', error);
}

// Basic error handler to surface errors instead of silent 500s
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Connect DB and start server (for local)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}

// Export app for Vercel serverless
export default app;
