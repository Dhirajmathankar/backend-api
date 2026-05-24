const mongoose = require('mongoose');

const NotificationLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true // फ़ास्ट सर्च के लिए इंडेक्सिंग
  },
  activeTripId: {
    type: String,
    default: null,
    index: true
  },
  appPackage: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ""
  },
  rawBody: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    default: 0
  },
  merchant: {
    type: String,
    default: "Unknown"
  },
  isGroupExpense: {
    type: Boolean,
    default: false
  },
  isTagged: {
    type: String,
    enum: ['clean', 'will-get', 'will-give'],
    default: 'clean' // डिफ़ॉल्ट रूप से यह क्लीन कैश हिस्ट्री रहेगा
  },
  type: { 
    type: String, 
    enum: ['credit', 'debit'], 
    default: 'credit' 
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('NotificationLog', NotificationLogSchema);