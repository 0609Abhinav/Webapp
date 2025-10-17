// const User = require('../models/User');

// // If your file is named 'message.js'
// const Message = require('../models/messageModel');


// // ---------------- GET MESSAGES ----------------
// exports.getMessages = async (req, res) => {
//   try {
//     const fromUserId = Number(req.query.fromUserId);
//     const toUserId = Number(req.query.toUserId);

//     if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId)) {
//       return res.status(400).json({ status: 'error', message: 'Invalid or missing user IDs.' });
//     }

//     const messages = await Message.findChat(fromUserId, toUserId);

//     res.status(200).json({ status: 'success', data: messages, count: messages.length });
//   } catch (err) {
//     console.error('⚠️ Error fetching messages:', err);
//     res.status(500).json({ status: 'error', message: 'Internal server error', error: err.message });
//   }
// };

// // ---------------- SEND MESSAGE ----------------
// exports.sendMessage = async (req, res) => {
//   try {
//     const fromUserId = Number(req.body.fromUserId);
//     const toUserId = Number(req.body.toUserId);
//     const text = req.body.text?.trim();

//     if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId) || !text) {
//       return res.status(400).json({ status: 'error', message: 'Missing or invalid fields.' });
//     }

//     // Save message
//     const message = await Message.createMessage({ fromUserId, toUserId, messages: text });

//     // Fetch full message with user info
//     const fullMessage = await Message.findByPk(message.id, {
//       include: [
//         { model: User, as: 'fromUser', attributes: ['id', 'fullName', 'email'] },
//         { model: User, as: 'toUser', attributes: ['id', 'fullName', 'email'] },
//       ],
//     });

//     res.status(201).json({ status: 'success', data: fullMessage, message: 'Message sent successfully' });
//   } catch (err) {
//     console.error('⚠️ Error sending message:', err);
//     res.status(500).json({ status: 'error', message: 'Internal server error', error: err.message });
//   }
// };

const User = require('../models/User');
const Message = require('../models/messageModel');

// GET chat messages
exports.getMessages = async (req, res) => {
  try {
    const fromUserId = Number(req.query.fromUserId);
    const toUserId = Number(req.query.toUserId);

    if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid or missing user IDs.' });
    }

    const messages = await Message.findChat(fromUserId, toUserId);

    // Format messages for frontend
    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      from: msg.fromUserId,
      to: msg.toUserId,
      text: msg.messages,
      timestamp: msg.timestamp,
      fromUser: msg.fromUser,
      toUser: msg.toUser,
    }));

    res.status(200).json({ status: 'success', data: formattedMessages, count: formattedMessages.length });
  } catch (err) {
    console.error('⚠️ Error fetching messages:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error', error: err.message });
  }
};

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const fromUserId = Number(req.body.fromUserId);
    const toUserId = Number(req.body.toUserId);
    const text = req.body.text?.trim();

    if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId) || !text) {
      return res.status(400).json({ status: 'error', message: 'Missing or invalid fields.' });
    }

    const fullMessage = await Message.createMessage({ fromUserId, toUserId, messages: text });

    res.status(201).json({ status: 'success', data: fullMessage, message: 'Message sent successfully' });
  } catch (err) {
    console.error('⚠️ Error sending message:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error', error: err.message });
  }
};
