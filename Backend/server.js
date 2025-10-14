// const express = require('express');
// const cors = require('cors');
// const stateRoutes = require('./routes/stateRoutes');
// const userRoutes = require('./routes/userRoutes');
// const recordRoutes = require('./routes/recordRoutes');

// const app = express();

// app.use(cors());
// app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
// app.use('/uploads', express.static('uploads'));

// app.use('/api/states', stateRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/records', recordRoutes);

// app.listen(3002, () => console.log('Backend running on port 3002'));



// const express = require('express');
// const cors = require('cors');
// const stateRoutes = require('./routes/stateRoutes');
// const userRoutes = require('./routes/userRoutes');
// const recordRoutes = require('./routes/recordRoutes');
// const { WebSocketServer } = require('ws');

// const app = express();

// // ---------------- MIDDLEWARE ----------------
// app.use(cors());
// app.use(express.json({ limit: '10mb' })); // Allow large payloads (for images)
// app.use('/uploads', express.static('uploads'));

// // ---------------- ROUTES ----------------
// app.use('/api/states', stateRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/records', recordRoutes);

// // ---------------- SERVER ----------------
// const PORT = 3002;
// const server = app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

// // ---------------- WEBSOCKET ----------------
// const wss = new WebSocketServer({ server });

// // Broadcast function to send messages to all connected clients
// function broadcast(message) {
//   wss.clients.forEach((client) => {
//     if (client.readyState === client.OPEN) {
//       client.send(JSON.stringify(message));
//     }
//   });
// }

// wss.on('connection', (ws) => {
//   console.log('WebSocket client connected');

//   ws.on('close', () => {
//     console.log('WebSocket client disconnected');
//   });

//   ws.on('message', (msg) => {
//     console.log('Received message from client:', msg);
//   });
// });

// // Export broadcast function so controllers can use it
// module.exports = { broadcast };


const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');

// Import routes
const stateRoutes = require('./routes/stateRoutes');
const userRoutes = require('./routes/userRoutes');
const recordRoutes = require('./routes/recordRoutes');

// Initialize Express
const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow large payloads (for images)
app.use('/uploads', express.static('uploads'));

// ---------------- ROUTES ----------------
app.use('/api/states', stateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 3002;
const server = app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));

// ---------------- WEBSOCKET ----------------
const wss = new WebSocketServer({ server });

// Safe broadcast function
function broadcast(message) {
  if (!wss || !wss.clients) return;
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      try {
        client.send(JSON.stringify(message));
      } catch (err) {
        console.error("❌ WebSocket send error:", err);
      }
    }
  });
}

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('🔗 WebSocket client connected');

  ws.on('message', (msg) => {
    console.log('📨 Received message from client:', msg.toString());
  });

  ws.on('close', () => {
    console.log('❌ WebSocket client disconnected');
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down server...');
  server.close(() => process.exit(0));
});

// ---------------- EXPORTS ----------------
// Export BOTH app and broadcast for controllers & testing
module.exports = { app, broadcast };
