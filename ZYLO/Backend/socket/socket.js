const { Server } = require('socket.io');
const verifyUserFromToken = require('../utils/auth.helper');
const Message = require('../models/Message.model');

let io;

// ─── Track online users: userId → Set of socketIds ────────────────────────────
const onlineUsers = new Map(); // userId (string) → Set<socketId>

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: '*' },
    // FIX: allow both polling and websocket — Render.com needs polling first
    // to establish session, then upgrades to websocket automatically
    transports: ['polling', 'websocket'],
  });

  // ─── Auth Middleware ─────────────────────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const user = await verifyUserFromToken(token);
      if (!user) return next(new Error('Unauthorized'));
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    console.log('User connected:', socket.id, '| userId:', userId);

    // Join personal room
    socket.join(userId);

    // ─── Track Online Status ───────────────────────────────────────────────────
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Broadcast this user is online to ALL connected users (including self)
    // so everyone's onlineUsers set stays in sync
    io.emit('userOnline', { userId });

    // Send current online list to newly connected user
    socket.emit('onlineUsers', Array.from(onlineUsers.keys()));

    // FIX: Client reconnect ke baad server dobara online list maang sakta hai
    socket.on('getOnlineUsers', () => {
      const userIds = Array.from(onlineUsers.keys()); // ✅ define first, then use
      console.log('Online users sent:', userIds);
      socket.emit('onlineUsers', userIds);
    });

    // ─── Send Message ──────────────────────────────────────────────────────────
    socket.on('sendMessage', async ({ receiverId, message, messageType, fileUrl, fileName, fileSize }) => {
      try {
        const senderId = socket.user._id.toString();

        const newMsg = await Message.create({
          senderId,
          receiverId,
          message: message || '',
          messageType: messageType || 'text',
          fileUrl: fileUrl || null,
          fileName: fileName || null,
          fileSize: fileSize || null,
        });

        // FIX: .toObject() so createdAt/updatedAt are plain JS values, not Mongoose internals
        // Yeh ensure karta hai ki client ko createdAt milta hai for time display
        const plainMsg = newMsg.toObject();
        // Ensure timestamp exists for frontend sorting/display
        if (!plainMsg.timestamp) plainMsg.timestamp = new Date();

        // Emit to receiver
        io.to(receiverId.toString()).emit('receiveMessage', plainMsg);
        // Emit back to sender (all sender's tabs)
        io.to(senderId).emit('receiveMessage', plainMsg);

        // Notify receiver about unread count update
        io.to(receiverId.toString()).emit('unreadCountUpdate', {
          fromUserId: senderId,
        });

      } catch (err) {
        console.error('sendMessage error:', err);
      }
    });

    // ─── Typing Indicator ──────────────────────────────────────────────────────
    socket.on('typing', ({ receiverId }) => {
      io.to(receiverId.toString()).emit('userTyping', {
        senderId: userId,
      });
    });

    socket.on('stopTyping', ({ receiverId }) => {
      io.to(receiverId.toString()).emit('userStopTyping', {
        senderId: userId,
      });
    });

    // ─── Mark Messages as Read ─────────────────────────────────────────────────
    socket.on('markRead', async ({ senderId: msgSenderId }) => {
      try {
        await Message.updateMany(
          { senderId: msgSenderId, receiverId: userId, isRead: false },
          { $set: { isRead: true } }
        );
        // Notify the original sender their messages were read
        io.to(msgSenderId.toString()).emit('messagesRead', {
          byUserId: userId,
        });
      } catch (err) {
        console.error('markRead error:', err);
      }
    });

    // ─── Disconnect ────────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          // Broadcast offline only when last tab closes
          socket.broadcast.emit('userOffline', { userId });
        }
      }
    });
  });
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};

module.exports = { initSocket, getIO };