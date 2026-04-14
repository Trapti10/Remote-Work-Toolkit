import React from 'react'
import { useState } from "react";
import { Smile, Paperclip, Send, Mic, Menu } from "lucide-react";
import { useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import { io } from "socket.io-client";
import { BiLeftArrow } from 'react-icons/bi';
import { FaArrowLeft } from 'react-icons/fa';
import { useRef } from "react";


const Chat = () => {
  const [showChats, setShowChats] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const [users, setUsers] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [chatUsers, setChatUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false)
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"))
  const userId = user?._id;

  useEffect(() => {
    if (socketRef.current) return;

    socketRef.current = io(import.meta.env.VITE_BASE_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
      transports: ["websocket"],
      reconnection: true,
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Connected:", socketRef.current.id);
    });

    socketRef.current.on("receiveMessage", (msg) => {
  setMessages((prev) => {
    if (prev.some((m) => m._id === msg._id)) return prev;
    return [...prev, msg];
  });
});

    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null;
    };
  }, []);

  const fetchChatUsers = async () => {
    try {
      const res = await api.get("/chat/chatUsers");
      setChatUsers(res.data);
    } catch (error) {
      toast.error("Error fetching chat users");
    }
  };
  useEffect(() => {
    if (userId) fetchChatUsers();
  }, [userId]);

  useEffect(() => {
    if (!receiverId) return;
    const loadMessages = async () => {
      try {
        const res = await api.get(
          `/chat/messages/${userId}/${receiverId}`
        );

        setMessages(res.data);
        console.log("Fetched messages:", res.data);
      } catch (err) {
        toast.error("Error fetching messages");
      }
    };

    loadMessages();
  }, [receiverId]); // only depend on receiver


  const sendMessage = async () => {
    if (!message.trim() || !receiverId || !socketRef.current) return;

    try {
      const newMsg = {
        _id: Date.now(),
        message,
        senderId: userId,
      };
    if (!socketRef.current?.connected) {
  toast.error("Socket not connected");
  return;
}

setMessages((prev) => [...prev, newMsg]);
      // Send real-time
      socketRef.current.emit("sendMessage", {
        receiverId,
        message,
      });

      console.log(message);
      setMessage("");
    } catch (err) {
      toast.error("Error sending message");
    }

  }

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleNewChat = () => {
    fetchUsers();
    setShowNewChat(true);
  }

  const handleTyping = (e) => {
    setMessage(e.target.value);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    <div className="h-full flex bg-gray-100 relative border border-none rounded-full">

      {/* Mobile Toggle Button */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 bg-white p-2 rounded-lg shadow"
        onClick={() => setShowChats(!showChats)}
      >
        <Menu />
      </button>

      {/* Chat List */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-70 border-r border-gray-200 bg-zinc-100 p-4 transform transition-transform duration-300 z-40 ${showChats ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >

        <button onClick={handleNewChat} className='text-white bg-purple-700 p-2 w-full rounded-md'>+ Add New Chat</button>

        {showNewChat && (
          <div className="absolute inset-0  flex flex-col items-center  z-50 bg-white">
            <div className="flex w-full py-4  gap-2 border-b border-gray-200">
              <i onClick={() => setShowNewChat(false)} className='size-8 flex items-center justify-center hover:bg-gray-200'><FaArrowLeft /></i>
              <h2 className="font-semibold mb-3 text-gray-700">Start New Chat</h2>
            </div>
            <div className=" px-10 w-80 max-h-155 overflow-y-auto">

              {users.map((u) => (
                <div
                  key={u._id}
                  onClick={() => {
                    setReceiverId(u._id);
                    setShowNewChat(false);
                    setSelectedUser(u)
                    setShowChats(false);
                    fetchChatUsers();
                  }}
                  className="p-2 hover:bg-gray-200 rounded cursor-pointer"
                >
                  {u.fullname?.firstname} {u.fullname?.lastname}
                </div>
              ))}
            </div>
          </div>
        )}


        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 mb-4 mt-4 border rounded-lg"
        />

        <div className="space-y-2">
          {chatUsers.map((u) => (
            <div
              key={u._id}
              onClick={() => {
                setSelectedUser(u);
                setReceiverId(u._id);
                setShowChats(false);
              }}
              className={`p-3 rounded-xl cursor-pointer ${selectedUser?._id === u._id
                ? "bg-purple-100 border-l-4 border-purple-500"
                : "hover:bg-gray-200"
                }`}>
              <p className="font-medium">{u.fullname?.firstname} {u.fullname?.lastname}</p>
              {isTyping && selectedUser?._id === u._id && (
                <p className="text-xs text-green-500 animate-pulse">
                  typing...
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {!selectedUser ? (
        <div className="flex flex-col items-center m-auto justify-center h-full text-center">

          <img
            src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
            alt="start chat"
            className="w-32 md:w-40 opacity-70 mb-4 "
          />

          <h2 className="text-lg md:text-xl font-semibold text-gray-700">
            Start a Conversation
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Select a user from sidebar or start a new chat
          </p>

        </div>
      ) : (
        <>
          {/* Chat Window */}
          <div className="flex-1 flex flex-col w-full">
            {/* Header */}
            <div className="p-4 bg-white shadow flex items-center gap-2 border-b border-gray-50">
              <span className="h-8 w-8 rounded-full bg-purple-400 flex items-center justify-center">{selectedUser?.fullname?.firstname?.charAt(0)}</span>
              <h3 className="font-sans"> {selectedUser
                ? `${selectedUser.fullname?.firstname} ${selectedUser.fullname?.lastname}`
                : "Select a chat"}</h3>
              {isTyping && selectedUser && (
                <p className="text-xs text-green-500 animate-pulse">
                  typing...
                </p>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"} `}>
                  <div className={`bg-gray-200 p-3 rounded-xl max-w-[75%] md:max-w-xs ${msg.senderId === userId
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200"
                    }`}>
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={bottomRef}></div>

            </div>



            {/* Input */}
            <div className="p-3 md:p-4 bg-white flex items-center gap-2 md:gap-3">
              {/* Emoji */}
              <button className="text-gray-500 hover:text-purple-500">
                <Smile size={20} />
              </button>

              {/* File Upload */}
              <button className="text-gray-500 hover:text-purple-500">
                <Paperclip size={20} />
              </button>

              {/* Input Field */}
              <input
                type="text"
                value={message}
                onChange={handleTyping}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-xl text-sm md:text-base"
              />

              {/* Mic */}
              <button className="text-gray-500 hover:text-purple-500 hidden sm:block">
                <Mic size={20} />
              </button>

              {/* Send Button */}
              <button
                onClick={sendMessage}
                className="bg-purple-500 hover:bg-purple-600 text-white p-2 md:p-3 rounded-xl">
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );

}

export default Chat
