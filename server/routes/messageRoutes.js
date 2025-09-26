import express from 'express';
import { createMessage } from '../controller/messageController.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/', createMessage); // Create new message from contact form

export default router;
