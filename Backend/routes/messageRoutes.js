const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// GET chat messages: /api/messages?fromUserId=1&toUserId=2
router.get('/', messageController.getMessages);

// POST new message: /api/messages
router.post('/', messageController.sendMessage);

module.exports = router;
