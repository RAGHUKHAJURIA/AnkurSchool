import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import studentRouter from './routes/studentRoutes.js';
import contentRouter from './routes/contentRoutes.js';

// Configure dotenv to load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

await connectDB();


app.get('/', (req, res) => {
    res.send("Home Route")
})

// Routes
app.use('/api/students', studentRouter);
app.use('/api/content', contentRouter);


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})