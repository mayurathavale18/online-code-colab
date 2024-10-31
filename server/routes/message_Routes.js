// routes/messageRoutes.js
const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Get messages for a room
router.get('/:roomId', async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save a new message
router.post('/', async (req, res) => {
  try {
    const { roomId, message } = req.body;
    const newMessage = new Message({ roomId, message });
    await newMessage.save();
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
