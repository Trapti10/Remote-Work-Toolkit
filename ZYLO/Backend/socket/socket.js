const { Server } = require("socket.io");
const verifyUserFromToken = require('../utils/auth.helper');

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

        socket.on("join", (userId)=>{
            socket.join(userId);
        })
        
        socket.on("sendMessage", ({senderId, receiverId, message})=>{
            io.to(receiverId).emit("receiveMessage",{
                senderId,
                message,
            })
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