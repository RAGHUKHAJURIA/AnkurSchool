import Message from '../models/message.js';

// Create a new message
const createMessage = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }

        // Create new message
        const newMessage = new Message({
            name,
            email,
            phone: phone || '',
            message
        });

        await newMessage.save();

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: {
                id: newMessage._id,
                name: newMessage.name,
                email: newMessage.email,
                message: newMessage.message,
                createdAt: newMessage.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};

// Get all messages (admin only)
const getAllMessages = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        // Build query
        const query = {};
        if (status && ['unread', 'read', 'replied'].includes(status)) {
            query.status = status;
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get messages with pagination
        const messages = await Message.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        // Get total count for pagination
        const totalMessages = await Message.countDocuments(query);
        const totalPages = Math.ceil(totalMessages / parseInt(limit));

        res.json({
            success: true,
            data: {
                messages,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalMessages,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
};

// Get unread messages count (for notifications)
const getUnreadCount = async (req, res) => {
    try {
        const unreadCount = await Message.countDocuments({
            status: 'unread',
            isRead: false
        });

        res.json({
            success: true,
            data: {
                unreadCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch unread count',
            error: error.message
        });
    }
};

// Get recent unread messages (for notifications)
const getRecentUnreadMessages = async (req, res) => {
    try {
        const { limit = 5 } = req.query;

        const messages = await Message.find({
            status: 'unread',
            isRead: false
        })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .select('name email message createdAt')
            .lean();

        res.json({
            success: true,
            data: {
                messages
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent messages',
            error: error.message
        });
    }
};

// Get single message by ID
const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            data: {
                message
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch message',
            error: error.message
        });
    }
};

// Mark message as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Message.findByIdAndUpdate(
            id,
            {
                isRead: true,
                status: 'read',
                readAt: new Date()
            },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            message: 'Message marked as read',
            data: {
                message
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to mark message as read',
            error: error.message
        });
    }
};

// Mark message as replied
const markAsReplied = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminNotes } = req.body || {};

        const message = await Message.findByIdAndUpdate(
            id,
            {
                status: 'replied',
                repliedAt: new Date(),
                adminNotes: adminNotes || ''
            },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            message: 'Message marked as replied',
            data: {
                message
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to mark message as replied',
            error: error.message
        });
    }
};

// Delete message
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Message.findByIdAndDelete(id);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete message',
            error: error.message
        });
    }
};

// Get message statistics
const getMessageStats = async (req, res) => {
    try {
        const totalMessages = await Message.countDocuments();
        const unreadMessages = await Message.countDocuments({ status: 'unread' });
        const readMessages = await Message.countDocuments({ status: 'read' });
        const repliedMessages = await Message.countDocuments({ status: 'replied' });

        // Get messages from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentMessages = await Message.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        res.json({
            success: true,
            data: {
                totalMessages,
                unreadMessages,
                readMessages,
                repliedMessages,
                recentMessages
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch message statistics',
            error: error.message
        });
    }
};

export {
    createMessage,
    getAllMessages,
    getUnreadCount,
    getRecentUnreadMessages,
    getMessageById,
    markAsRead,
    markAsReplied,
    deleteMessage,
    getMessageStats
};
