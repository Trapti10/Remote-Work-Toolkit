const { Server } = require("socket.io");
const verifyUserFromToken = require('../utils/auth.helper');
const Message = require("../models/Message.model");


let io;

const initSocket = (server)=>{
    
    io = new Server(server, {
        cors:{
            origin: "*",
        },
    });

    // SOCKET AUTH MIDDLEWARE

    io.use(async (socket, next)=>{
        try {
            const token = socket.handshake.auth?.token;

            const user = await verifyUserFromToken(token);

            if(!user){
                return next(new Error("Unauthorized"));
            }
            socket.user = user; //attach user
            next();
        } catch (error) {
            next(new Error("Unauthorized"));
        }
    })

    io.on("connection", (socket)=>{
        console.log("User connected: ", socket.id);

        socket.join(socket.user._id.toString());
        
        socket.on("sendMessage", async({ receiverId, message})=>{
            try{
                const senderId = socket.user._id;
                
                const newMsg = await Message.create({
                    senderId,
                    receiverId,
                    message,
                })
                io.to(receiverId).emit("receiveMessage",newMsg);
                io.to(senderId.toString()).emit("receiveMessage",newMsg);
            }catch(err){
                console.log(err);   
            }
        })

        socket.on("disconnect", () =>{
            console.log("User disconnected");
        });
    });
};

const getIO = () =>{
    if(!io) throw new Error("Socket.io not initialized!");
    return io;
}

module.exports = {initSocket, getIO};