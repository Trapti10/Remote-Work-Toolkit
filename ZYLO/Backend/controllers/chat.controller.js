const Message = require('../models/Message.model');
const {getIO} = require("../socket/socket");
const userModel = require('../models/user.model')

exports.sendMessage = async (req, res) =>{
    const {senderId, receiverId, message} = req.body;

    const newMsg = await Message.create({senderId, receiverId, message});
    
    const io = getIO(); //emit via socket

    io.to(receiverId).emit("receiveMessage", newMsg);

    res.json(newMsg);
}
exports.getMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "Error fetching messages" });
    }
};

exports.getChatUsers = async (req,res)=>{
    try{
     const userId = req.user._id;

     //find all users where user is sender or receiver
     const messages = await Message.find({
        $or:[
            {senderId: userId},
            {receiverId: userId},
        ],
     })

      const userIds = new Set();

    messages.forEach((msg) => {
      if (msg.senderId.toString() !== userId.toString()) {
        userIds.add(msg.senderId.toString());
      }
      if (msg.receiverId.toString() !== userId.toString()) {
        userIds.add(msg.receiverId.toString());
      }
    });

    // fetch users from DB
    const users = await userModel.find({
      _id: { $in: Array.from(userIds) },
    });

    res.json(users);
    }catch(err){
 console.error(err);
    res.status(500).json({ message: "Error fetching chat users" });
    }
}