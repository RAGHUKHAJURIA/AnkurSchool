import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import studentRouter from './routes/studentRoutes.js';
import contentRouter from './routes/contentRoutes.js';
import { clerkMiddleware } from '@clerk/express'
import { clerkWebhooks } from './controller/webhooks.js'

// Configure dotenv to load environment variables
dotenv.config();

const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(clerkMiddleware())

await connectDB();


app.get('/', (req, res) => {
  res.send("Home Route")
})

// Routes
app.post("/clerk", express.raw({ type: "application/json" }), clerkWebhooks);
app.use('/api/students', studentRouter);
app.use('/api/content', clerkMiddleware(), contentRouter);


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})