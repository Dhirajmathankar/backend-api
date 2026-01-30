const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatUser'
  },
  message: String,
  sender: {
    type: String,
    enum: ['USER', 'BOT'],
    default: 'USER'
  }
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
