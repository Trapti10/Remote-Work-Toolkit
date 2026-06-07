const File = require('../models/File.model');

// ─── Helper: Detect file type from mime ───────────────────────────────────────
const getFileType = (mimeType) => {
    if (!mimeType) return 'other';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) return 'spreadsheet';
    if (mimeType.includes('word') || mimeType.includes('document') || mimeType.includes('text/')) return 'document';
    return 'other';
};

// ─── Upload File ──────────────────────────────────────────────────────────────
// Upload is done on frontend via Cloudinary directly (like in Chat).
// Backend just saves the metadata to MongoDB.
exports.uploadFile = async (req, res) => {
    try {
        const { fileUrl, fileName, fileSize, mimeType, projectName, description, cloudinaryPublicId } = req.body;
        const uploadedBy = req.user._id;

        if (!fileUrl || !fileName) {
            return res.status(400).json({ message: 'fileUrl and fileName are required' });
        }

        const newFile = await File.create({
            uploadedBy,
            fileName,
            originalName: fileName,
            fileUrl,
            fileType: getFileType(mimeType),
            mimeType: mimeType || '',
            fileSize: fileSize || 0,
            projectName: projectName || '',
            description: description || '',
            cloudinaryPublicId: cloudinaryPublicId || '',
        });

        await newFile.populate('uploadedBy', 'fullname email');
        res.status(201).json(newFile);
    } catch (err) {
        console.error('uploadFile error:', err);
        res.status(500).json({ message: 'Error uploading file' });
    }
};

// ─── Get All Files ────────────────────────────────────────────────────────────
exports.getFiles = async (req, res) => {
    try {
        const { search, type } = req.query;
        const query = {};

        if (type && type !== 'all') query.fileType = type;
        if (search) {
            query.$or = [
                { fileName: { $regex: search, $options: 'i' } },
                { projectName: { $regex: search, $options: 'i' } },
            ];
        }

        const files = await File.find(query)
            .populate('uploadedBy', 'fullname email')
            .sort({ createdAt: -1 });

        res.json(files);
    } catch (err) {
        console.error('getFiles error:', err);
        res.status(500).json({ message: 'Error fetching files' });
    }
};

// ─── Delete File ──────────────────────────────────────────────────────────────
// Only deletes from MongoDB — Cloudinary file stays (no API secret needed on backend).
// If you want Cloudinary cleanup too, add it via a Cloudinary webhook or pass API secret.
exports.deleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const file = await File.findById(id);
        if (!file) return res.status(404).json({ message: 'File not found' });

        if (file.uploadedBy.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this file' });
        }

        await File.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (err) {
        console.error('deleteFile error:', err);
        res.status(500).json({ message: 'Error deleting file' });
    }
};