const mongoose = require('mongoose');

const mittraSheetEmailLogSchema = new mongoose.Schema({
  to: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['SENT', 'FAILED'],
    default: 'SENT'
  },
  errorMessage: {
    type: String,
    default: null
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // agar login user hai
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model(
  'mittraSheetEmailLog',
  mittraSheetEmailLogSchema
);
