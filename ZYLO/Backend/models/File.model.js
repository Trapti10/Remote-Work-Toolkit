const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        enum: ['image', 'pdf', 'document', 'spreadsheet', 'video', 'audio', 'other'],
        default: 'other',
    },
    mimeType: {
        type: String,
        default: '',
    },
    fileSize: {
        type: Number,
        default: 0,
    },
    projectName: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    cloudinaryPublicId: {
        type: String,
        default: '',
    },
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);