// routes/roomRoutes.js
const express = require('express');
const Room = require('../models/Room');
const router = express.Router();

// Get room code by roomId
router.get('/:roomId', async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (room) res.json(room);
    else res.status(404).json({ message: "Room not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save or update room code
router.post('/:roomId', async (req, res) => {
  try {
    const { code } = req.body;
    const room = await Room.findOneAndUpdate(
      { roomId: req.params.roomId },
      { code },
      { new: true, upsert: true }
    );
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
