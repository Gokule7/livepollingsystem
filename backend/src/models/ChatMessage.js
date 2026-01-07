const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isTeacher: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
