const mongoose = require('mongoose');

const KhataLedgerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  personName: {
    type: String,
    required: true,
    trim: true
  },
  personPhone: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: [1, "अमाउंट कम से कम ₹1 होना चाहिए"]
  },
  khataType: {
    type: String,
    enum: ['will-get', 'will-give'], // will-get = उधार दिया (लेना है), will-give = उधार लिया (देना है)
    required: true
  },
  reason: {
    type: String,
    default: "Personal", // क्यों लिया या दिया (e.g., Office Lunch, Fuel, Chai)
    trim: true
  },
  paymentMode: {
    type: String,
    enum: ['cash', 'online'],
    default: 'cash'
  },
  notificationSentStatus: {
    type: String,
    enum: ['sent', 'failed', 'pending'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// फ़ास्ट सर्चिंग के लिए कंपाउंड इंडेक्स
KhataLedgerSchema.index({ userId: 1, personPhone: 1 });

module.exports = mongoose.model('KhataLedger', KhataLedgerSchema);