// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
