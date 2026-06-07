const express = require('express');
const { authUser } = require('../middlewares/auth.middleware');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

// Messages
router.post('/send', authUser, chatController.sendMessage);
router.get('/messages/:senderId/:receiverId', authUser, chatController.getMessages);

// Users
router.get('/chatUsers', authUser, chatController.getChatUsers);

// Read receipts
router.patch('/markAsRead/:senderId', authUser, chatController.markAsRead);

module.exports = router;