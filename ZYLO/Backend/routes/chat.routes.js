const express = require('express');
const { authUser } = require('../middlewares/auth.middleware');
const router = express.Router();
chatController = require('../controllers/chat.controller');

router.post("/send",authUser, chatController.sendMessage);

router.get("/messages/:senderId/:receiverId",authUser,  chatController.getMessages)

router.get("/chatUsers", authUser, chatController.getChatUsers)

module.exports = router;