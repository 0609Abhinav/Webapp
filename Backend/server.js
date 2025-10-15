const express = require('express');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');

// Routes
const stateRoutes = require('./routes/stateRoutes');
const userRoutes = require('./routes/userRoutes');
const recordRoutes = require('./routes/recordRoutes');
const messageRoutes = require('./routes/messageRoutes'); // Chat REST API

// ---------------- EXPRESS APP ----------------
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------------- ROUTES ----------------
app.use('/api/states', stateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/messages', messageRoutes); // GET & POST chat messages

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 3002;
const server = http.createServer(app);

// ---------------- SOCKET.IO SERVER ----------------
const io = new Server(server, {
  cors: {
    origin: "*", // change to your frontend origin if needed
    methods: ["GET", "POST"],
  },
});

// Track connected users (userId -> socket)
const connectedUsers = new Map();

// ---------------- SOCKET HANDLERS ----------------
io.on('connection', (socket) => {
  console.log(`🔗 New Socket.IO connection: ${socket.id}`);

  // Handle initialization (user joins chat)
  socket.on('init', (data) => {
    const { userId } = data;
    if (!userId) return;
    socket.userId = userId;
    connectedUsers.set(userId, socket);
    console.log(`✅ User connected: ${userId}`);
    socket.emit('system', { message: 'Connected to chat server' });
  });

  // Handle chat messages
  socket.on('chatMessage', (data) => {
    const { from, to, message } = data;
    if (!from || !to || !message) return;

    console.log(`💬 Message from ${from} to ${to}: ${message}`);

    const payload = {
      from,
      to,
      message,
      timestamp: new Date(),
    };

    // Send message to recipient if connected
    const recipientSocket = connectedUsers.get(to);
    if (recipientSocket) {
      recipientSocket.emit('receive-message', payload);
    }

    // Send message back to sender
    socket.emit('receive-message', payload);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      console.log(`❌ User disconnected: ${socket.userId}`);
    } else {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    }
  });

  // Handle errors gracefully
  socket.on('error', (err) => {
    console.error(`⚠️ Socket error (${socket.userId || socket.id}):`, err.message);
  });
});

// ---------------- SERVER START ----------------
server.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});

// ---------------- GLOBAL ERROR HANDLERS ----------------
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Promise Rejection:', reason);
});

// ---------------- GRACEFUL SHUTDOWN ----------------
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down server...');
  io.sockets.sockets.forEach((s) => s.disconnect(true));
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('🛑 Manual stop detected (Ctrl+C)');
  io.sockets.sockets.forEach((s) => s.disconnect(true));
  server.close(() => process.exit(0));
});

module.exports = { app, io, connectedUsers };
