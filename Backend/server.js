
// // const express = require('express');
// // const cors = require('cors');
// // const path = require('path');
// // const { Server } = require('socket.io');
// // const http = require('http');
// // const Message = require('./models/messageModel');

// // // Routes
// // const stateRoutes = require('./routes/stateRoutes');
// // const userRoutes = require('./routes/userRoutes');
// // const recordRoutes = require('./routes/recordRoutes');
// // const messageRoutes = require('./routes/messageRoutes');

// // // ---------------- EXPRESS APP ----------------
// // const app = express();
// // app.use(cors());
// // app.use(express.json({ limit: '10mb' }));
// // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // // ---------------- ROUTES ----------------
// // app.use('/api/states', stateRoutes);
// // app.use('/api/users', userRoutes);
// // app.use('/api/records', recordRoutes);
// // app.use('/api/messages', messageRoutes);

// // // ---------------- SERVER ----------------
// // const PORT = process.env.PORT || 3002;
// // const server = http.createServer(app);

// // // ---------------- SOCKET.IO SERVER ----------------
// // const io = new Server(server, {
// //   cors: {
// //     origin: "*", // adjust to your frontend
// //     methods: ["GET", "POST"],
// //   },
// // });

// // // Map to track online users (userId => socket)
// // const onlineUsers = new Map();

// // // Broadcast online users to everyone
// // const broadcastOnlineUsers = () => {
// //   const users = Array.from(onlineUsers.keys());
// //   io.emit('online-users', users);
// // };

// // // ---------------- SOCKET HANDLERS ----------------
// // io.on('connection', (socket) => {
// //   console.log(`🔗 New connection: ${socket.id}`);

// //   // Initialize user
// //   socket.on('init', ({ userId }) => {
// //     if (!userId) return;
// //     socket.userId = userId;
// //     onlineUsers.set(userId, socket);
// //     console.log(`✅ User online: ${userId}`);
    
// //     // Notify this user
// //     socket.emit('system', { message: 'Connected to chat server' });

// //     // Broadcast updated online users
// //     broadcastOnlineUsers();
// //   });

// //   // Handle chat messages
// //   socket.on('chatMessage', async ({ from, to, message }) => {
// //     if (!from || !to || !message) return;
// //     const timestamp = new Date();

// //     try {
// //       // Save message to DB
// //       await Message.createMessage({ fromUserId: from, toUserId: to, messages: message });

// //       const payload = { from, to, text: message, timestamp };

// //       // Send to recipient if online
// //       const recipientSocket = onlineUsers.get(to);
// //       if (recipientSocket) recipientSocket.emit('receive-message', payload);

// //       // Send back to sender
// //       socket.emit('receive-message', payload);

// //       console.log(`💬 ${from} → ${to}: ${message}`);
// //     } catch (err) {
// //       console.error('⚠️ Error saving message:', err.message);
// //       socket.emit('error', { message: 'Failed to send message' });
// //     }
// //   });

// //   // Handle disconnect
// //   socket.on('disconnect', () => {
// //     if (socket.userId) {
// //       onlineUsers.delete(socket.userId);
// //       console.log(`❌ User offline: ${socket.userId}`);
// //       broadcastOnlineUsers(); // Update all clients
// //     } else {
// //       console.log(`❌ Socket disconnected: ${socket.id}`);
// //     }
// //   });

// //   // Handle errors
// //   socket.on('error', (err) => {
// //     console.error(`⚠️ Socket error (${socket.userId || socket.id}):`, err.message);
// //   });
// // });

// // // ---------------- SERVER START ----------------
// // server.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));

// // // ---------------- GLOBAL ERROR HANDLERS ----------------
// // process.on('uncaughtException', (err) => console.error('💥 Uncaught Exception:', err));
// // process.on('unhandledRejection', (reason) => console.error('💥 Unhandled Rejection:', reason));

// // // ---------------- GRACEFUL SHUTDOWN ----------------
// // const shutdown = () => {
// //   console.log('🛑 Shutting down server...');
// //   io.sockets.sockets.forEach((s) => s.disconnect(true));
// //   server.close(() => process.exit(0));
// // };

// // process.on('SIGTERM', shutdown);
// // process.on('SIGINT', shutdown);

// // module.exports = { app, io, onlineUsers };


// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const { Server } = require('socket.io');
// const http = require('http');
// const Message = require('./models/messageModel');

// // Routes
// const stateRoutes = require('./routes/stateRoutes');
// const userRoutes = require('./routes/userRoutes');
// const recordRoutes = require('./routes/recordRoutes');
// const messageRoutes = require('./routes/messageRoutes');

// // ---------------- EXPRESS APP ----------------
// const app = express();
// app.use(cors());
// app.use(express.json({ limit: '10mb' }));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ---------------- ROUTES ----------------
// app.use('/api/states', stateRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/records', recordRoutes);
// app.use('/api/messages', messageRoutes);

// // ---------------- SERVER ----------------
// const PORT = process.env.PORT || 3002;
// const server = http.createServer(app);

// // ---------------- SOCKET.IO SERVER ----------------
// const io = new Server(server, {
//   cors: {
//     origin: "*", // adjust to your frontend URL if needed
//     methods: ["GET", "POST"],
//   },
// });

// // Map to track online users (userId => socket)
// const onlineUsers = new Map();

// // Broadcast list of online users to all clients
// const broadcastOnlineUsers = () => {
//   const users = Array.from(onlineUsers.keys());
//   io.emit('online-users', users);
// };

// // ---------------- SOCKET HANDLERS ----------------
// io.on('connection', (socket) => {
//   console.log(`🔗 New connection: ${socket.id}`);

//   // Initialize user
//   socket.on('init', ({ userId }) => {
//     if (!userId) return;
//     socket.userId = userId;
//     onlineUsers.set(String(userId), socket);
//     console.log(`✅ User online: ${userId}`);

//     // Notify this user
//     socket.emit('system', { message: 'Connected to chat server' });

//     // Update everyone
//     broadcastOnlineUsers();
//   });

//   // Handle chat messages (no DB insert here)
//   socket.on('chatMessage', ({ from, to, message, timestamp }) => {
//     if (!from || !to || !message) return;

//     const payload = {
//       from,
//       to,
//       text: message,
//       timestamp: timestamp || new Date(),
//     };

//     // ✅ Broadcast message to recipient if online
//     const recipientSocket = onlineUsers.get(String(to));
//     if (recipientSocket) recipientSocket.emit('receive-message', payload);

//     // ✅ Echo back to sender (to ensure message shows instantly)
//     socket.emit('receive-message', payload);

//     console.log(`💬 ${from} → ${to}: ${message}`);
//   });

//   // Handle disconnect
//   socket.on('disconnect', () => {
//     if (socket.userId) {
//       onlineUsers.delete(String(socket.userId));
//       console.log(`❌ User offline: ${socket.userId}`);
//       broadcastOnlineUsers();
//     } else {
//       console.log(`❌ Socket disconnected: ${socket.id}`);
//     }
//   });

//   // Handle socket errors
//   socket.on('error', (err) => {
//     console.error(`⚠️ Socket error (${socket.userId || socket.id}):`, err.message);
//   });
// });

// // ---------------- SERVER START ----------------
// server.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));

// // ---------------- GLOBAL ERROR HANDLERS ----------------
// process.on('uncaughtException', (err) => console.error('💥 Uncaught Exception:', err));
// process.on('unhandledRejection', (reason) => console.error('💥 Unhandled Rejection:', reason));

// // ---------------- GRACEFUL SHUTDOWN ----------------
// const shutdown = () => {
//   console.log('🛑 Shutting down server...');
//   io.sockets.sockets.forEach((s) => s.disconnect(true));
//   server.close(() => process.exit(0));
// };

// process.on('SIGTERM', shutdown);
// process.on('SIGINT', shutdown);

// module.exports = { app, io, onlineUsers };


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');
const axios = require('axios');
const Message = require('./models/messageModel');

// Routes
const stateRoutes = require('./routes/stateRoutes');
const userRoutes = require('./routes/userRoutes');
const recordRoutes = require('./routes/recordRoutes');
const messageRoutes = require('./routes/messageRoutes');

// ---------------- EXPRESS APP ----------------
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------------- ROUTES ----------------
app.use('/api/states', stateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/messages', messageRoutes);

// ✅ ---------------- GEMINI AI PROXY ROUTE ----------------
app.post('/api/gemini', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [{ parts: [{ text: message }] }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': process.env.GEMINI_API_KEY,
        },
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm not sure how to respond to that.";

    res.json({ reply });
  } catch (error) {
    console.error('❌ Gemini API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Error communicating with Gemini API',
      details: error.response?.data || error.message,
    });
  }
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 3002;
const server = http.createServer(app);

// ---------------- SOCKET.IO SERVER ----------------
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const onlineUsers = new Map();

const broadcastOnlineUsers = () => {
  const users = Array.from(onlineUsers.keys());
  io.emit('online-users', users);
};

io.on('connection', (socket) => {
  console.log(`🔗 Connected: ${socket.id}`);

  socket.on('init', ({ userId }) => {
    if (!userId) return;
    socket.userId = userId;
    onlineUsers.set(String(userId), socket);
    console.log(`✅ User online: ${userId}`);
    socket.emit('system', { message: 'Connected to chat server' });
    broadcastOnlineUsers();
  });

  socket.on('chatMessage', ({ from, to, message, timestamp }) => {
    if (!from || !message) return;

    const payload = { from, to, text: message, timestamp: timestamp || new Date() };

    // Broadcast to sender
    socket.emit('receive-message', payload);
    console.log(`💬 ${from}: ${message}`);
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(String(socket.userId));
      console.log(`❌ User offline: ${socket.userId}`);
      broadcastOnlineUsers();
    }
  });
});

server.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));

process.on('uncaughtException', (err) => console.error('💥 Uncaught Exception:', err));
process.on('unhandledRejection', (reason) => console.error('💥 Unhandled Rejection:', reason));

const shutdown = () => {
  console.log('🛑 Shutting down...');
  io.sockets.sockets.forEach((s) => s.disconnect(true));
  server.close(() => process.exit(0));
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = { app, io, onlineUsers };
