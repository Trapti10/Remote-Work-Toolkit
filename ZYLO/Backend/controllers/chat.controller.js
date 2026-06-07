const Message = require('../models/Message.model');
const { getIO } = require('../socket/socket');
const userModel = require('../models/user.model');

// ─── Send Message (HTTP fallback) ──────────────────────────────────────────────
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, messageType, fileUrl, fileName, fileSize } = req.body;

    const newMsg = await Message.create({
      senderId,
      receiverId,
      message: message || '',
      messageType: messageType || 'text',
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      fileSize: fileSize || null,
    });

    const io = getIO();
    io.to(receiverId.toString()).emit('receiveMessage', newMsg.toObject());
    io.to(senderId.toString()).emit('receiveMessage', newMsg.toObject());

    res.json(newMsg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending message' });
  }
};

// ─── Get Messages ──────────────────────────────────────────────────────────────
exports.getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ timestamp: 1 });

    await Message.updateMany(
      { senderId: receiverId, receiverId: senderId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

// ─── Get Chat Users (sidebar) ──────────────────────────────────────────────────
exports.getChatUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ timestamp: -1 });

    const userIds = new Set();
    messages.forEach((msg) => {
      if (msg.senderId.toString() !== userId.toString()) userIds.add(msg.senderId.toString());
      if (msg.receiverId.toString() !== userId.toString()) userIds.add(msg.receiverId.toString());
    });

    const users = await userModel.find({ _id: { $in: Array.from(userIds) } });

    const usersWithUnread = await Promise.all(
      users.map(async (u) => {
        const unreadCount = await Message.countDocuments({
          senderId: u._id,
          receiverId: userId,
          isRead: false,
        });
        return { ...u.toObject(), unreadCount };
      })
    );

    res.json(usersWithUnread);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching chat users' });
  }
};

// ─── Mark Messages as Read ─────────────────────────────────────────────────────
exports.markAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    const receiverId = req.user._id;

    await Message.updateMany(
      { senderId, receiverId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Error marking messages as read' });
  }
};