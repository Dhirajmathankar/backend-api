const mongoose = require('mongoose');

const KhataSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null }, // यदि ट्रिप का खर्चा है
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // किसने पे किया
  amount: { type: Number, required: true },
  merchant: { type: String, required: true },
  paymentMode: { type: String, enum: ['online', 'offline'], default: 'online' }, // PhonePe = online, नकद = offline
  description: { type: String },
  // स्प्लिट लॉजिक: किन-किन यूज़र्स के बीच यह पैसा बटेगा
  splitBetween: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    share: { type: Number, required: true } // प्रति व्यक्ति हिस्सा
  }]
}, { timestamps: true });

module.exports = mongoose.model('Khata', KhataSchema);