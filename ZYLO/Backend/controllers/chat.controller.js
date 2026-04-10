const Message = require('../models/Message.model');
const {getIO} = require("../socket/socket");

exports.sendMessage = async (req, res) =>{
    const {senderId, receiverId, message} = req.body;

    const newMsg = await Message.create({senderId, receiverId, message});
    
    const io = getIO(); //emit via socket

    io.to(receiverId).emit("receiveMessage", newMsg);

    res.json(newMsg);
}