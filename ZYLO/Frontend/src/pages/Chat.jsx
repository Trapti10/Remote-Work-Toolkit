import React from 'react'
import { useState } from "react";
import { Smile, Paperclip, Send, Mic, Menu } from "lucide-react";

const Chat = () => {

  const [showChats, setShowChats] = useState(false);

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
        className={`fixed md:static top-0 left-0 h-full w-72 border-r border-gray-200 bg-zinc-100 p-4 transform transition-transform duration-300 z-40 ${
          showChats ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 mb-4 border rounded-lg"
        />

        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-purple-100 border-l-4 border-purple-500">
            <p className="font-medium">Alexis Sears</p>
            <p className="text-sm text-gray-500">Typing...</p>
          </div>

          <div className="p-3 rounded-xl hover:bg-gray-200">
            <p className="font-medium">Jane Cooper</p>
            <p className="text-sm text-gray-500">Sent document</p>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <div className="p-4 bg-white shadow flex items-center gap-2 border-b border-gray-50">
          <span className="h-8 w-8 rounded-full bg-purple-400 flex items-center justify-center">A</span>
          <h3 className="font-semibold">Alexis Sears</h3>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
          {/* Incoming */}
          <div className="flex">
            <div className="bg-gray-200 p-3 rounded-xl max-w-[75%] md:max-w-xs">
              Hi, Landing design status?
            </div>
          </div>

          {/* Outgoing */}
          <div className="flex justify-end">
            <div className="bg-purple-500 text-white p-3 rounded-xl max-w-[75%] md:max-w-xs">
              Design sent in email. Please check it.
            </div>
          </div>

          {/* Incoming */}
          <div className="flex">
            <div className="bg-gray-200 p-3 rounded-xl max-w-[75%] md:max-w-xs">
              Sure, I will upload it soon.
            </div>
          </div>
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
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-xl text-sm md:text-base"
          />

          {/* Mic */}
          <button className="text-gray-500 hover:text-purple-500 hidden sm:block">
            <Mic size={20} />
          </button>

          {/* Send Button */}
          <button className="bg-purple-500 hover:bg-purple-600 text-white p-2 md:p-3 rounded-xl">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );

}

export default Chat
