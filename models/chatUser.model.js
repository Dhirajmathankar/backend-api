const mongoose = require('mongoose');

const chatUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobile: String,
  isWelcomeMailSent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('ChatUser', chatUserSchema);
