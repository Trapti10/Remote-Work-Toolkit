const express = require('express');
const { authUser } = require('../middlewares/auth.middleware');
const router = express.Router();
chatController = require('../controllers/chat.controller');

router.post("/send",authUser, chatController.sendMessage);

module.exports = router;