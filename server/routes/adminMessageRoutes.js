import express from 'express';
import {
    getAllMessages,
    getUnreadCount,
    getRecentUnreadMessages,
    getMessageById,
    markAsRead,
    markAsReplied,
    deleteMessage,
    getMessageStats
} from '../controller/messageController.js';

const router = express.Router();

// Admin routes (authentication required)
router.get('/all', getAllMessages); // Get all messages with pagination
router.get('/unread-count', getUnreadCount); // Get unread messages count
router.get('/recent-unread', getRecentUnreadMessages); // Get recent unread messages
router.get('/stats', getMessageStats); // Get message statistics
router.get('/:id', getMessageById); // Get single message by ID
router.patch('/:id/read', markAsRead); // Mark message as read
router.patch('/:id/replied', markAsReplied); // Mark message as replied
router.delete('/:id', deleteMessage); // Delete message

export default router;


