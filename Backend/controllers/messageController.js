// // const User = require('../models/User');

// // // If your file is named 'message.js'
// // const Message = require('../models/messageModel');


// // // ---------------- GET MESSAGES ----------------
// // exports.getMessages = async (req, res) => {
// //   try {
// //     const fromUserId = Number(req.query.fromUserId);
// //     const toUserId = Number(req.query.toUserId);

// //     if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId)) {
// //       return res.status(400).json({ status: 'error', message: 'Invalid or missing user IDs.' });
// //     }

// //     const messages = await Message.findChat(fromUserId, toUserId);

// //     res.status(200).json({ status: 'success', data: messages, count: messages.length });
// //   } catch (err) {
// //     console.error('⚠️ Error fetching messages:', err);
// //     res.status(500).json({ status: 'error', message: 'Internal server error', error: err.message });
// //   }
// // };

// // // ---------------- SEND MESSAGE ----------------
// // exports.sendMessage = async (req, res) => {
// //   try {
// //     const fromUserId = Number(req.body.fromUserId);
// //     const toUserId = Number(req.body.toUserId);
// //     const text = req.body.text?.trim();

// //     if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId) || !text) {
// //       return res.status(400).json({ status: 'error', message: 'Missing or invalid fields.' });
// //     }

// //     // Save message
// //     const message = await Message.createMessage({ fromUserId, toUserId, messages: text });

// //     // Fetch full message with user info
// //     const fullMessage = await Message.findByPk(message.id, {
// //       include: [
// //         { model: User, as: 'fromUser', attributes: ['id', 'fullName', 'email'] },
// //         { model: User, as: 'toUser', attributes: ['id', 'fullName', 'email'] },
// //       ],
// //     });

// //     res.status(201).json({ status: 'success', data: fullMessage, message: 'Message sent successfully' });
// //   } catch (err) {
// //     console.error('⚠️ Error sending message:', err);
// //     res.status(500).json({ status: 'error', message: 'Internal server error', error: err.message });
// //   }
// // };

// // const User = require('../models/User');
// // const Message = require('../models/messageModel');

// // // GET chat messages
// // exports.getMessages = async (req, res) => {
// //   try {
// //     const fromUserId = Number(req.query.fromUserId);
// //     const toUserId = Number(req.query.toUserId);

// //     if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId)) {
// //       return res.status(400).json({ status: 'error', message: 'Invalid or missing user IDs.' });
// //     }

// //     const messages = await Message.findChat(fromUserId, toUserId);

// //     // Format messages for frontend
// //     const formattedMessages = messages.map((msg) => ({
// //       id: msg.id,
// //       from: msg.fromUserId,
// //       to: msg.toUserId,
// //       text: msg.messages,
// //       timestamp: msg.timestamp,
// //       fromUser: msg.fromUser,
// //       toUser: msg.toUser,
// //     }));

// //     res.status(200).json({ status: 'success', data: formattedMessages, count: formattedMessages.length });
// //   } catch (err) {
// //     console.error('⚠️ Error fetching messages:', err);
// //     res.status(500).json({ status: 'error', message: 'Internal server error', error: err.message });
// //   }
// // };

// // // SEND MESSAGE
// // exports.sendMessage = async (req, res) => {
// //   try {
// //     const fromUserId = Number(req.body.fromUserId);
// //     const toUserId = Number(req.body.toUserId);
// //     const text = req.body.text?.trim();

// //     if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId) || !text) {
// //       return res.status(400).json({ status: 'error', message: 'Missing or invalid fields.' });
// //     }

// //     const fullMessage = await Message.createMessage({ fromUserId, toUserId, messages: text });

// //     res.status(201).json({ status: 'success', data: fullMessage, message: 'Message sent successfully' });
// //   } catch (err) {
// //     console.error('⚠️ Error sending message:', err);
// //     res.status(500).json({ status: 'error', message: 'Internal server error', error: err.message });
// //   }
// // };


// // const User = require('../models/User');
// // const Message = require('../models/messageModel');

// // // -------------------- GET CHAT MESSAGES --------------------
// // exports.getMessages = async (req, res) => {
// //   try {
// //     const fromUserId = Number(req.query.fromUserId);
// //     const toUserId = Number(req.query.toUserId);

// //     if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId)) {
// //       return res.status(400).json({
// //         status: 'error',
// //         message: 'Invalid or missing user IDs.',
// //       });
// //     }

// //     const messages = await Message.findChat(fromUserId, toUserId);

// //     const formattedMessages = messages.map((msg) => ({
// //       id: msg.id,
// //       from: msg.fromUserId,
// //       to: msg.toUserId,
// //       text: msg.messages,
// //       files: msg.files || [], // ✅ Include Cloudinary URLs
// //       timestamp: msg.timestamp,
// //       fromUser: msg.fromUser,
// //       toUser: msg.toUser,
// //     }));

// //     res.status(200).json({
// //       status: 'success',
// //       data: formattedMessages,
// //       count: formattedMessages.length,
// //     });
// //   } catch (err) {
// //     console.error('⚠️ Error fetching messages:', err);
// //     res.status(500).json({
// //       status: 'error',
// //       message: 'Internal server error',
// //       error: err.message,
// //     });
// //   }
// // };

// // // -------------------- SEND MESSAGE --------------------
// // exports.sendMessage = async (req, res) => {
// //   try {
// //     const fromUserId = Number(req.body.fromUserId);
// //     const toUserId = Number(req.body.toUserId);
// //     const text = req.body.text?.trim();
// //     const uploadedFiles = req.files ? req.files.map((file) => file.path) : [];

// //     if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId)) {
// //       return res.status(400).json({
// //         status: 'error',
// //         message: 'Invalid user IDs.',
// //       });
// //     }

// //     if (!text && uploadedFiles.length === 0) {
// //       return res.status(400).json({
// //         status: 'error',
// //         message: 'Message must contain text or at least one file.',
// //       });
// //     }

// //     const messageData = {
// //       fromUserId,
// //       toUserId,
// //       messages: text || '',
// //       files: uploadedFiles, // ✅ Store Cloudinary URLs
// //     };

// //     const fullMessage = await Message.createMessage(messageData);

// //     res.status(201).json({
// //       status: 'success',
// //       data: fullMessage,
// //       message: 'Message sent successfully.',
// //     });
// //   } catch (err) {
// //     console.error('⚠️ Error sending message:', err);
// //     res.status(500).json({
// //       status: 'error',
// //       message: 'Internal server error',
// //       error: err.message,
// //     });
// //   }
// // };


// // const User = require('../models/User');
// // const Message = require('../models/messageModel');

// // // -------------------- GET CHAT MESSAGES --------------------
// // exports.getMessages = async (req, res) => {
// //   try {
// //     const fromUserId = Number(req.query.fromUserId);
// //     const toUserId = Number(req.query.toUserId);

// //     if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId)) {
// //       return res.status(400).json({
// //         status: 'error',
// //         message: 'Invalid or missing user IDs.',
// //       });
// //     }

// //     const messages = await Message.findChat(fromUserId, toUserId);

// //     const formattedMessages = messages.map((msg) => ({
// //       id: msg.id,
// //       from: msg.fromUserId,
// //       to: msg.toUserId,
// //       text: msg.messages,
// //       files: msg.files || [],
// //       timestamp: msg.timestamp,
// //       fromUser: msg.fromUser,
// //       toUser: msg.toUser,
// //     }));

// //     res.status(200).json({
// //       status: 'success',
// //       data: formattedMessages,
// //       count: formattedMessages.length,
// //     });
// //   } catch (err) {
// //     console.error('⚠️ Error fetching messages:', err);
// //     res.status(500).json({
// //       status: 'error',
// //       message: 'Internal server error',
// //       error: err.message,
// //     });
// //   }
// // };

// // // -------------------- SEND MESSAGE --------------------
// // exports.sendMessage = async (req, res) => {
// //   try {
// //     const fromUserId = Number(req.body.fromUserId);
// //     const toUserId = Number(req.body.toUserId);
// //     const text = req.body.text?.trim();
// //     const uploadedFiles = req.files
// //       ? req.files.map((file) => file.path || file.secure_url)
// //       : [];

// //     if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId)) {
// //       return res.status(400).json({
// //         status: 'error',
// //         message: 'Invalid user IDs.',
// //       });
// //     }

// //     if (fromUserId === toUserId) {
// //       return res.status(400).json({
// //         status: 'error',
// //         message: 'Cannot send a message to yourself.',
// //       });
// //     }

// //     if (!text && uploadedFiles.length === 0) {
// //       return res.status(400).json({
// //         status: 'error',
// //         message: 'Message must contain text or at least one file.',
// //       });
// //     }

// //     const messageData = {
// //       fromUserId,
// //       toUserId,
// //       messages: text || '',
// //       files: uploadedFiles,
// //     };

// //     const fullMessage = await Message.createMessage(messageData);

// //     res.status(201).json({
// //       status: 'success',
// //       data: fullMessage,
// //       message: 'Message sent successfully.',
// //     });
// //   } catch (err) {
// //     console.error('⚠️ Error sending message:', err);
// //     res.status(500).json({
// //       status: 'error',
// //       message: 'Internal server error',
// //       error: err.message,
// //     });
// //   }
// // };


// // const User = require('../models/User');
// // const Message = require('../models/messageModel');

// // // -------------------- GET CHAT MESSAGES --------------------
// // exports.getMessages = async (req, res) => {
// //   try {
// //     const fromUserId = Number(req.query.fromUserId);
// //     const toUserId = Number(req.query.toUserId);

// //     if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId)) {
// //       return res.status(400).json({
// //         status: 'error',
// //         message: 'Invalid or missing user IDs.',
// //       });
// //     }

// //     const messages = await Message.findChat(fromUserId, toUserId);

// //     const formattedMessages = messages.map((msg) => ({
// //       id: msg.id,
// //       from: msg.fromUserId,
// //       to: msg.toUserId,
// //       message: msg.messages, // frontend expects 'message'
// //       files: msg.files || [],
// //       timestamp: msg.timestamp,
// //       fromUser: msg.fromUser,
// //       toUser: msg.toUser,
// //     }));

// //     return res.status(200).json({
// //       status: 'success',
// //       data: formattedMessages,
// //       count: formattedMessages.length,
// //     });
// //   } catch (err) {
// //     console.error('⚠️ Error fetching messages:', err);
// //     return res.status(500).json({
// //       status: 'error',
// //       message: 'Internal server error',
// //       error: err.message,
// //     });
// //   }
// // };

// // // -------------------- SEND MESSAGE --------------------
// // exports.sendMessage = async (req, res) => {
// //   try {
// //     const fromUserId = Number(req.body.fromUserId);
// //     const toUserId = Number(req.body.toUserId);
// //     const text = req.body.text?.trim();
// //     const uploadedFiles = req.files
// //       ? req.files.map((file) => file.filename || file.path || file.secure_url)
// //       : [];

// //     // Validate IDs
// //     if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId)) {
// //       return res.status(400).json({
// //         status: 'error',
// //         message: 'Invalid user IDs.',
// //       });
// //     }

// //     if (fromUserId === toUserId) {
// //       return res.status(400).json({
// //         status: 'error',
// //         message: 'Cannot send a message to yourself.',
// //       });
// //     }

// //     // Validate content
// //     if (!text && uploadedFiles.length === 0) {
// //       return res.status(400).json({
// //         status: 'error',
// //         message: 'Message must contain text or at least one file.',
// //       });
// //     }

// //     // Create message
// //     const messageData = {
// //       fromUserId,
// //       toUserId,
// //       messages: text || '',
// //       files: uploadedFiles,
// //       timestamp: new Date(),
// //     };

// //     const fullMessage = await Message.createMessage(messageData);

// //     return res.status(201).json({
// //       status: 'success',
// //       data: {
// //         id: fullMessage.id,
// //         from: fullMessage.fromUserId,
// //         to: fullMessage.toUserId,
// //         message: fullMessage.messages,
// //         files: fullMessage.files || [],
// //         timestamp: fullMessage.timestamp,
// //       },
// //       message: 'Message sent successfully.',
// //     });
// //   } catch (err) {
// //     console.error('⚠️ Error sending message:', err);
// //     return res.status(500).json({
// //       status: 'error',
// //       message: 'Internal server error',
// //       error: err.message,
// //     });
// //   }
// // };


// const User = require('../models/User');
// const Message = require('../models/messageModel');
// const { v2: cloudinary } = require('cloudinary');

// // -------------------- GET CHAT MESSAGES --------------------
// exports.getMessages = async (req, res) => {
//   try {
//     const fromUserId = Number(req.query.fromUserId);
//     const toUserId = Number(req.query.toUserId);

//     if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId)) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Invalid or missing user IDs.',
//       });
//     }

//     const messages = await Message.findChat(fromUserId, toUserId);

//     // Format messages for frontend with Cloudinary URLs
//     const formattedMessages = messages.map((msg) => ({
//       id: msg.id,
//       from: msg.fromUserId,
//       to: msg.toUserId,
//       message: msg.messages,
//       files: msg.files || [], // Already stored as Cloudinary URLs
//       timestamp: msg.timestamp,
//       fromUser: msg.fromUser,
//       toUser: msg.toUser,
//     }));

//     return res.status(200).json({
//       status: 'success',
//       data: formattedMessages,
//       count: formattedMessages.length,
//     });
//   } catch (err) {
//     console.error('⚠️ Error fetching messages:', err);
//     return res.status(500).json({
//       status: 'error',
//       message: 'Internal server error',
//       error: err.message,
//     });
//   }
// };

// // -------------------- SEND MESSAGE --------------------
// exports.sendMessage = async (req, res) => {
//   try {
//     const fromUserId = Number(req.body.fromUserId);
//     const toUserId = Number(req.body.toUserId);
//     const text = req.body.text?.trim();

//     if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId)) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Invalid user IDs.',
//       });
//     }

//     if (fromUserId === toUserId) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Cannot send a message to yourself.',
//       });
//     }

//     // Map files to Cloudinary secure URLs
//     const uploadedFiles = req.files
//       ? req.files.map((file) => {
//           // multer-storage-cloudinary stores full secure_url in file.path or file.secure_url
//           return file.secure_url || file.path || file.filename;
//         })
//       : [];

//     if (!text && uploadedFiles.length === 0) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Message must contain text or at least one file.',
//       });
//     }

//     const messageData = {
//       fromUserId,
//       toUserId,
//       messages: text || '',
//       files: uploadedFiles, // store Cloudinary URLs
//       timestamp: new Date(),
//     };

//     const fullMessage = await Message.createMessage(messageData);

//     // Send back full message with Cloudinary URLs ready for preview
//     return res.status(201).json({
//       status: 'success',
//       data: {
//         id: fullMessage.id,
//         from: fullMessage.fromUserId,
//         to: fullMessage.toUserId,
//         message: fullMessage.messages,
//         files: fullMessage.files || [], // Cloudinary URLs
//         timestamp: fullMessage.timestamp,
//       },
//       message: 'Message sent successfully.',
//     });
//   } catch (err) {
//     console.error('⚠️ Error sending message:', err);
//     return res.status(500).json({
//       status: 'error',
//       message: 'Internal server error',
//       error: err.message,
//     });
//   }
// };


const User = require('../models/User');
const Message = require('../models/messageModel');

// -------------------- GET CHAT MESSAGES --------------------
exports.getMessages = async (req, res) => {
  try {
    const fromUserId = Number(req.query.fromUserId);
    const toUserId = Number(req.query.toUserId);

    if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or missing user IDs.',
      });
    }

    // Fetch messages between these two users only
    const messages = await Message.findChat(fromUserId, toUserId);

    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      from: msg.fromUserId,
      to: msg.toUserId,
      message: msg.messages,
      files: msg.files || [],
      timestamp: msg.timestamp,
      fromUser: msg.fromUser,
      toUser: msg.toUser,
    }));

    return res.status(200).json({
      status: 'success',
      data: formattedMessages,
      count: formattedMessages.length,
    });
  } catch (err) {
    console.error('⚠️ Error fetching messages:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: err.message,
    });
  }
};

// -------------------- SEND MESSAGE --------------------
exports.sendMessage = async (req, res) => {
  try {
    const fromUserId = Number(req.body.fromUserId);
    const toUserId = Number(req.body.toUserId);
    const text = req.body.text?.trim();

    if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid user IDs.',
      });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot send a message to yourself.',
      });
    }

    // Map uploaded files to Cloudinary secure URLs
    const uploadedFiles = req.files
      ? req.files.map((file) => file.secure_url || file.path || file.filename)
      : [];

    if (!text && uploadedFiles.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Message must contain text or at least one file.',
      });
    }

    const messageData = {
      fromUserId,
      toUserId,
      messages: text || '',
      files: uploadedFiles,
      timestamp: new Date(),
    };

    const fullMessage = await Message.createMessage(messageData);

    return res.status(201).json({
      status: 'success',
      data: {
        id: fullMessage.id,
        from: fullMessage.fromUserId,
        to: fullMessage.toUserId,
        message: fullMessage.messages,
        files: fullMessage.files || [],
        timestamp: fullMessage.timestamp,
      },
      message: 'Message sent successfully.',
    });
  } catch (err) {
    console.error('⚠️ Error sending message:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: err.message,
    });
  }
};

// -------------------- GET FILES FOR CHAT --------------------
exports.getFilesForChat = async (req, res) => {
  try {
    const fromUserId = Number(req.query.fromUserId);
    const toUserId = Number(req.query.toUserId);

    if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or missing user IDs.',
      });
    }

    const messages = await Message.findChat(fromUserId, toUserId);
    const files = messages.flatMap((msg) => msg.files || []);

    return res.status(200).json({
      status: 'success',
      count: files.length,
      data: files,
    });
  } catch (err) {
    console.error('⚠️ Error fetching chat files:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: err.message,
    });
  }
};
