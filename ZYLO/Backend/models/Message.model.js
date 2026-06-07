const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        default: '',
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'document', 'video', 'audio'],
        default: 'text',
    },
    fileUrl: {
        type: String,
        default: null,
    },
    fileName: {
        type: String,
        default: null,
    },
    fileSize: {
        type: Number,
        default: null,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Message', messageSchema);