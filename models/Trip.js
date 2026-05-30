const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  tripName: { type: String, required: true },
  destination: { type: String, default: 'Goa' },
  budget: { type: Number, default: 20000 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // 🔥 ट्रिप में शामिल सभी यूज़र्स की लिस्ट (जो आपने मांगी थी)
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  isActive: { type: Boolean, default: true },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  budget: { type: Number, default: 0 },
  createdAt: Date,
  updatedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Trip', TripSchema);