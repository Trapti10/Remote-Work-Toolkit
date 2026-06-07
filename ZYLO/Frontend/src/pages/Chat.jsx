import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Menu, X, Paperclip, Mic, MicOff, SmilePlus, FileText, ChevronDown, WifiOff } from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import EmojiPicker from 'emoji-picker-react';
import api from '../api';

// ─── Helpers ───────────────────────────────────────────────────────────────────
const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getMessageTypeFromFile = (fileType) => {
  if (fileType.startsWith('image/')) return 'image';
  if (fileType.startsWith('video/')) return 'video';
  if (fileType.startsWith('audio/')) return 'audio';
  return 'document';
};

const extractId = (val) => {
  if (!val) return '';
  if (typeof val === 'object' && val._id) return val._id.toString();
  return val.toString();
};

// ─── Date label helper ─────────────────────────────────────────────────────────
const getDateLabel = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a, b) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (sameDay(d, today)) return 'Today';
  if (sameDay(d, yesterday)) return 'Yesterday';
  return d.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
};

// Groups messages by date so we can render date separators
const groupMessagesByDate = (messages) => {
  const groups = [];
  let lastLabel = null;
  messages.forEach((msg) => {
    const label = getDateLabel(msg.timestamp);
    if (label !== lastLabel) {
      groups.push({ type: 'separator', label, key: `sep-${msg._id}` });
      lastLabel = label;
    }
    groups.push({ type: 'message', msg, key: msg._id });
  });
  return groups;
};

// ─── Read identity ONCE from localStorage at module parse time ─────────────────
const readCurrentUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return { user: {}, userId: '' };
    const parsed = JSON.parse(raw);
    const userId = extractId(parsed?._id);
    return { user: parsed, userId };
  } catch {
    return { user: {}, userId: '' };
  }
};

// ─── In-Memory Conversation Cache ──────────────────────────────────────────────
// conversationCache[conversationKey] = Message[]
// conversationKey = sorted pair of userId + receiverId joined by '_'
// This lives outside the component so it persists across re-renders but clears on page reload.
const conversationCache = {};

const getCacheKey = (a, b) => [a, b].sort().join('_');

// Sort messages by time — handles both timestamp and createdAt fields
const sortMessages = (msgs) =>
  [...msgs].sort((a, b) => {
    const tA = new Date(a.timestamp || 0).getTime();
    const tB = new Date(b.timestamp || 0).getTime();
    return tA - tB;
  });

// ─── Message Bubble ────────────────────────────────────────────────────────────
const MessageBubble = ({ msg, isOwn }) => {
  const base = `max-w-[75%] md:max-w-sm rounded-2xl px-4 py-2 text-sm shadow-sm`;
  const ownStyle = `${base} bg-purple-600 text-white rounded-br-none`;
  const otherStyle = `${base} bg-white text-gray-800 rounded-bl-none border border-gray-100`;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
      <div className={isOwn ? ownStyle : otherStyle}>
        {msg.messageType === 'image' && msg.fileUrl && (
          <img
            src={msg.fileUrl}
            alt={msg.fileName || 'image'}
            className="rounded-xl max-w-full mb-1 cursor-pointer"
            onClick={() => window.open(msg.fileUrl, '_blank')}
          />
        )}
        {msg.messageType === 'video' && msg.fileUrl && (
          <video controls className="rounded-xl max-w-full mb-1" src={msg.fileUrl} />
        )}
        {msg.messageType === 'document' && msg.fileUrl && (
          <a
            href={msg.fileUrl}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-2 mb-1 underline ${isOwn ? 'text-purple-100' : 'text-purple-600'}`}
          >
            <FileText size={16} />
            <span className="truncate max-w-50">{msg.fileName || 'File'}</span>
            {msg.fileSize && <span className="text-xs opacity-70">({formatFileSize(msg.fileSize)})</span>}
          </a>
        )}

        {msg.message && msg.message.trim() && (
          <p className="wrap-break-words leading-relaxed">{msg.message}</p>
        )}

        {/* ── Time shown below every message ── */}
        {/* Only show time if there is actual content to show */}
        {(msg.message?.trim() || msg.fileUrl) && (
          <p className={`text-[10px] mt-1 ${isOwn ? 'text-purple-200 text-right' : 'text-gray-400 text-right'}`}>
            {formatTime(msg.timestamp)}
          </p>
        )}
      </div>
    </div>
  );
};

// Guard: don't render bubble at all if no content
const SafeMessageBubble = ({ msg, isOwn }) => {
  const hasText = msg.message && msg.message.trim();
  const hasFile = msg.fileUrl;
  if (!hasText && !hasFile) return null;
  return <MessageBubble msg={msg} isOwn={isOwn} />;
};

// ─── Date Separator ────────────────────────────────────────────────────────────
const DateSeparator = ({ label }) => (
  <div className="flex items-center gap-3 my-3 px-2">
    <div className="flex-1 h-px bg-slate-200" />
    <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap px-2 py-0.5 bg-slate-100 rounded-full">
      {label}
    </span>
    <div className="flex-1 h-px bg-slate-200" />
  </div>
);

// ─── Message Loading Skeleton ──────────────────────────────────────────────────
const MessageSkeleton = () => (
  <div className="flex flex-col gap-3 px-4 py-4 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
        <div
          className={`h-9 rounded-2xl bg-slate-200 ${i % 2 === 0 ? 'rounded-bl-none' : 'rounded-br-none'}`}
          style={{ width: `${100 + (i * 37) % 120}px` }}
        />
      </div>
    ))}
  </div>
);

// ─── Main Chat Component ───────────────────────────────────────────────────────
const Chat = () => {
  const [showChats, setShowChats] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [receiverId, setReceiverId] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [networkError, setNetworkError] = useState(false);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);
  const receiverIdRef = useRef(receiverId);

  const identityRef = useRef(readCurrentUser());
  const userId = identityRef.current.userId;

  // Keep receiverIdRef in sync so socket callbacks always see the latest value
  useEffect(() => {
    receiverIdRef.current = receiverId;
  }, [receiverId]);

  // ─── Socket Setup ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (socketRef.current) return;

    socketRef.current = io(import.meta.env.VITE_BASE_URL, {
      auth: { token: localStorage.getItem('token') },
      // polling PEHLE — Render.com par WebSocket direct connect fail hoti hai
      // polling se session establish hoti hai, phir upgrade hoti hai websocket par
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setNetworkError(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connect_error:', err.message);
      setNetworkError(true);
    });

    socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
      setNetworkError(true);
    });

    socket.on('reconnect', () => {
      console.log('🔄 Socket reconnected');
      setNetworkError(false);
      socket.emit('getOnlineUsers');
    });

    socket.on('receiveMessage', (msg) => {
      const msgSenderId = extractId(msg.senderId);
      const msgReceiverId = extractId(msg.receiverId);
      const currentReceiverId = receiverIdRef.current;

      const isActiveConversation =
        (msgSenderId === userId && msgReceiverId === currentReceiverId) ||
        (msgReceiverId === userId && msgSenderId === currentReceiverId);

      if (isActiveConversation) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          const updated = sortMessages([...prev, msg]);

          // ── Update cache with the new message ──
          const cacheKey = getCacheKey(userId, currentReceiverId);
          conversationCache[cacheKey] = updated;

          return updated;
        });
      }

      // FIX: if message is from someone not in sidebar yet, add them via fetchChatUsers
      // This handles the case where a NEW person sends me a message first
      if (msgSenderId !== userId) {
        // Always refresh sidebar when we get a message from someone else
        // so new senders appear immediately
        fetchChatUsers();

        // Increment unread only if it's not the active conversation
        if (msgSenderId !== currentReceiverId) {
          setUnreadCounts((prev) => ({
            ...prev,
            [msgSenderId]: (prev[msgSenderId] || 0) + 1,
          }));
        }
      }
    });

    socket.on('onlineUsers', (userIds) => 
      setOnlineUsers(new Set(userIds)));
    socket.on('userOnline', ({ userId: uid }) =>
      setOnlineUsers((prev) => new Set([...prev, uid]))
    );
    socket.on('userOffline', ({ userId: uid }) =>
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(uid);
        return next;
      })
    );

    socket.on('userTyping', ({ senderId }) => {
      setTypingUsers((prev) => new Set([...prev, extractId(senderId)]));
    });
    socket.on('userStopTyping', ({ senderId }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(extractId(senderId));
        return next;
      });
    });

    socket.on('unreadCountUpdate', ({ fromUserId }) => {
      if (fromUserId !== receiverIdRef.current) {
        setUnreadCounts((prev) => ({
          ...prev,
          [fromUserId]: (prev[fromUserId] || 0) + 1,
        }));
      }
    });

    socket.on('messagesRead', ({ byUserId }) => {
      // Optional: could show double-tick here in future
      console.log('Messages read by:', byUserId);
    });

    // ✅ KEY FIX: Request online users AFTER all socket.on() listeners are registered.
    // If emitted inside 'connect' handler (at top), the 'onlineUsers' listener below
    // may not be attached yet on fast connections (localhost), causing it to be missed.
    if (socket.connected) {
      socket.emit('getOnlineUsers');
    } else {
      socket.once('connect', () => socket.emit('getOnlineUsers'));
    }

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Fetch Chat Users ─────────────────────────────────────────────────────
  const fetchChatUsers = useCallback(async () => {
    try {
      const res = await api.get('/chat/chatUsers');
      const users = res.data;
      setChatUsers(users);
      const counts = {};
      users.forEach((u) => {
        if (u.unreadCount > 0) counts[u._id] = u.unreadCount;
      });
      setUnreadCounts((prev) => ({ ...prev, ...counts }));
    } catch {
      toast.error('Error fetching chat users');
    }
  }, []);

  useEffect(() => {
    if (userId) fetchChatUsers();
  }, [userId, fetchChatUsers]);

  // ─── Fetch Messages (with cache) ──────────────────────────────────────────
  useEffect(() => {
    if (!receiverId) return;

    const cacheKey = getCacheKey(userId, receiverId);

    // ── Serve from cache instantly if available ──
    if (conversationCache[cacheKey]) {
      setMessages(conversationCache[cacheKey]);
      // Still mark as read silently on the server in background
      socketRef.current?.emit('markRead', { senderId: receiverId });
      setUnreadCounts((prev) => ({ ...prev, [receiverId]: 0 }));
      return; // Skip loading state & API call
    }

    // ── No cache: fetch from server ──
    const load = async () => {
      setMessagesLoading(true);
      try {
        const res = await api.get(`/chat/messages/${userId}/${receiverId}`);
        const fetched = res.data;
        const sorted = sortMessages(fetched);
        conversationCache[cacheKey] = sorted; // Store in cache
        setMessages(sorted);
        socketRef.current?.emit('markRead', { senderId: receiverId });
        setUnreadCounts((prev) => ({ ...prev, [receiverId]: 0 }));
      } catch {
        toast.error('Error fetching messages');
      } finally {
        setMessagesLoading(false);
      }
    };
    load();
  }, [receiverId, userId]);

  // ─── Auto scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
  };

  // ─── Typing ───────────────────────────────────────────────────────────────
  const handleTyping = (e) => {
    setMessage(e.target.value);
    setShowEmojiPicker(false);
    if (!receiverId || !socketRef.current) return;
    socketRef.current.emit('typing', { receiverId });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('stopTyping', { receiverId });
    }, 1500);
  };

  // ─── Send Message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async ({ text, fileUrl, fileName, fileSize, messageType } = {}) => {
      const msgText = text ?? message;
      if (!msgText.trim() && !fileUrl) return;

      if (!socketRef.current?.connected) {
        toast.error(
          networkError
            ? '⚠️ No network connection. Please check your internet and try again.'
            : 'Not connected to server. Retrying...'
        );
        return;
      }

      if (!receiverId) return;

      socketRef.current.emit('stopTyping', { receiverId });
      clearTimeout(typingTimeoutRef.current);

      socketRef.current.emit('sendMessage', {
        receiverId,
        message: msgText,
        messageType: messageType || 'text',
        fileUrl: fileUrl || null,
        fileName: fileName || null,
        fileSize: fileSize || null,
      });
      // Note: server will emit receiveMessage back with proper _id and createdAt
      // via socket.js toObject() — no optimistic update needed

      setMessage('');
      setShowEmojiPicker(false);

      const alreadyInList = chatUsers.some((u) => u._id === receiverId);
      if (!alreadyInList) fetchChatUsers();
    },
    [message, receiverId, chatUsers, fetchChatUsers, networkError]
  );

  // ─── Emoji ────────────────────────────────────────────────────────────────
  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  // ─── File Upload (Cloudinary) ────────────────────────────────────────────
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'lqxfyxdg');
      formData.append('cloud_name', 'dnargenj4');

      const uploadRes = await fetch(
        'https://api.cloudinary.com/v1_1/dnargenj4/auto/upload',
        { method: 'POST', body: formData }
      );
      if (!uploadRes.ok) throw new Error('Cloudinary upload failed');
      const uploadData = await uploadRes.json();

      await sendMessage({
        text: '',
        fileUrl: uploadData.secure_url,
        fileName: file.name,
        fileSize: file.size,
        messageType: getMessageTypeFromFile(file.type),
      });
    } catch (err) {
      console.error(err);
      toast.error('File upload failed');
    } finally {
      setUploadingFile(false);
    }
  };

  // ─── Voice ────────────────────────────────────────────────────────────────
  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice typing not supported in your browser');
      return;
    }
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => {
      setIsRecording(false);
      toast.error('Voice recognition error');
    };
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  // ─── Select User ──────────────────────────────────────────────────────────
  const selectUser = (u) => {
    const newReceiverId = u._id;
    const cacheKey = getCacheKey(userId, newReceiverId);
    // Load from cache IMMEDIATELY — no flash, no empty screen
    setMessages(conversationCache[cacheKey] || []);
    setSelectedUser(u);
    setReceiverId(newReceiverId);
    setShowChats(false);
    setShowNewChat(false);
  };

  const fetchAllUsers = async () => {
    try {
      const res = await api.get('/users');
      setAllUsers(res.data);
    } catch {
      toast.error('Error fetching users');
    }
  };

  // ─── Derived state ────────────────────────────────────────────────────────
  const selectedUserId = extractId(selectedUser?._id); // extractId handles ObjectId objects safely
  const isOtherUserTyping = !!selectedUserId && typingUsers.has(selectedUserId);
  const isSelectedOnline = !!selectedUserId && onlineUsers.has(selectedUserId);

  const filteredChatUsers = chatUsers.filter((u) => {
    const name = `${u.fullname?.firstname} ${u.fullname?.lastname}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  // ─── Group messages with date separators ──────────────────────────────────
  const groupedMessages = groupMessagesByDate(messages);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex bg-slate-100 relative overflow-hidden font-sans">

      {/* ── Network Error Banner ─────────────────────────────────────────── */}
      {networkError && (
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-red-500 text-white text-xs font-semibold py-2 px-4 shadow-lg">
          <WifiOff size={14} />
          <span>No network connection — please check your internet and reconnect</span>
        </div>
      )}

      {/* Mobile toggle */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 bg-white p-2 rounded-xl shadow-md"
        onClick={() => setShowChats(!showChats)}
      >
        {showChats ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-72 bg-white border-r border-slate-200 flex flex-col z-40 transform transition-transform duration-300 ${
          showChats ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-slate-100">
          <h1 className="text-lg font-bold text-slate-800 mb-3">Messages</h1>
          <button
            onClick={() => { fetchAllUsers(); setShowNewChat(true); }}
            className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
          >
            + New Chat
          </button>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mt-3 px-3 py-2 text-sm bg-slate-100 rounded-xl outline-none placeholder-slate-400"
          />
        </div>

        {/* New Chat Overlay */}
        {showNewChat && (
          <div className="absolute inset-0 bg-white z-50 flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b border-slate-100">
              <button onClick={() => setShowNewChat(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
              <h2 className="font-semibold text-slate-700">New Conversation</h2>
            </div>
            <div className="overflow-y-auto flex-1 p-2">
              {allUsers.map((u) => (
                <div
                  key={u._id}
                  onClick={() => { selectUser(u); fetchChatUsers(); }}
                  className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                    {u.fullname?.firstname?.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {u.fullname?.firstname} {u.fullname?.lastname}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat list */}
        <div className="overflow-y-auto flex-1 p-2">
          {filteredChatUsers.length === 0 && (
            <p className="text-center text-slate-400 text-sm mt-8">No conversations yet</p>
          )}
          {filteredChatUsers.map((u) => {
            const unread = unreadCounts[u._id] || 0;
            const isActive = selectedUser?._id === u._id;
            const isUserTyping = typingUsers.has(extractId(u._id));
            return (
              <div
                key={u._id}
                onClick={() => selectUser(u)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  isActive ? 'bg-purple-50 border border-purple-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    isActive ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {u.fullname?.firstname?.charAt(0)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isActive ? 'text-purple-800' : 'text-slate-700'}`}>
                    {u.fullname?.firstname} {u.fullname?.lastname}
                  </p>
                  {isUserTyping ? (
                    <p className="text-xs text-emerald-500 animate-pulse">typing...</p>
                  ) : (
                    <p className="text-xs text-slate-400 truncate">
                      {u.lastMessage || 'Tap to chat'}
                    </p>
                  )}
                </div>

                {unread > 0 && (
                  <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-purple-600 text-white text-[11px] font-bold flex items-center justify-center">
                    {unread > 99 ? '99+' : unread}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── Main Chat Area ────────────────────────────────────────────────── */}
      {!selectedUser ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 rounded-3xl bg-purple-100 flex items-center justify-center mb-4">
            <Send size={32} className="text-purple-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">Your Messages</h2>
          <p className="text-slate-400 text-sm max-w-xs">
            Select a conversation or start a new one to begin chatting
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-w-0 relative">

          {/* Chat Header */}
          <div className="px-5 py-3 bg-white border-b border-slate-100 flex items-center gap-3 shadow-sm">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                {selectedUser?.fullname?.firstname?.charAt(0)}
              </div>
              {isSelectedOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                {selectedUser?.fullname?.firstname} {selectedUser?.fullname?.lastname}
              </h3>
              {isOtherUserTyping ? (
                <p className="text-xs text-emerald-500 animate-pulse">typing...</p>
              ) : (
                <p className={`text-xs font-medium ${isSelectedOnline ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {isSelectedOnline ? '● Online' : '○ Offline'}
                </p>
              )}
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-1"
            style={{ background: 'linear-gradient(180deg, #f1f5f9 0%, #f8fafc 100%)' }}
          >
            {/* Loading skeleton — shown only on first fetch, not on cache hit */}
            {messagesLoading ? (
              <MessageSkeleton />
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-400 text-sm">No messages yet. Say hello! 👋</p>
              </div>
            ) : (
              groupedMessages.map((item) =>
                item.type === 'separator' ? (
                  <DateSeparator key={item.key} label={item.label} />
                ) : (
                  <SafeMessageBubble
                    key={item.key}
                    msg={item.msg}
                    isOwn={extractId(item.msg.senderId) === userId}
                  />
                )
              )
            )}

            {isOtherUserTyping && (
              <div className="flex justify-start mb-1">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {showScrollBtn && (
            <button
              onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="absolute bottom-24 right-6 w-9 h-9 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-700 transition-colors z-10"
            >
              <ChevronDown size={18} />
            </button>
          )}

          {showEmojiPicker && (
            <div className="absolute bottom-20 left-4 z-30">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                height={350}
                width={300}
                searchDisabled={false}
                skinTonesDisabled
                previewConfig={{ showPreview: false }}
              />
            </div>
          )}

          {/* Input Bar */}
          <div className="bg-white border-t border-slate-100 px-3 py-3 flex items-end gap-2">
            <button
              onClick={() => setShowEmojiPicker((p) => !p)}
              className={`p-2 rounded-xl transition-colors shrink-0 ${
                showEmojiPicker ? 'bg-purple-100 text-purple-600' : 'text-slate-400 hover:text-purple-500 hover:bg-slate-100'
              }`}
              title="Emoji"
            >
              <SmilePlus size={20} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
              onChange={handleFileSelect}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingFile}
              className="p-2 rounded-xl text-slate-400 hover:text-purple-500 hover:bg-slate-100 transition-colors shrink-0 disabled:opacity-40"
              title="Attach file"
            >
              {uploadingFile ? (
                <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Paperclip size={20} />
              )}
            </button>

            <textarea
              value={message}
              onChange={handleTyping}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 resize-none bg-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none placeholder-slate-400 max-h-28 overflow-y-auto"
              style={{ lineHeight: '1.5' }}
            />

            <button
              onClick={toggleVoice}
              className={`p-2 rounded-xl transition-colors shrink-0 ${
                isRecording
                  ? 'bg-red-100 text-red-500 animate-pulse'
                  : 'text-slate-400 hover:text-purple-500 hover:bg-slate-100'
              }`}
              title={isRecording ? 'Stop recording' : 'Voice input'}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <button
              onClick={() => sendMessage()}
              disabled={!message.trim() && !uploadingFile}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Send"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;