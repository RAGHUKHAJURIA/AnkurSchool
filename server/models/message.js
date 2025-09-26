import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'replied'],
        default: 'unread'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date,
        default: null
    },
    repliedAt: {
        type: Date,
        default: null
    },
    adminNotes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Index for better query performance
messageSchema.index({ status: 1, createdAt: -1 });
messageSchema.index({ isRead: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);
