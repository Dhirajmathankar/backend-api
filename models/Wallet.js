const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  totalBalance: { type: Number,     default: 0, required: true, set: v => Math.round(v * 100) / 100 },
  youWillGet: { type: Number, default: 0, set: v => Math.round(v * 100) / 100 },
  youWillGive: { type: Number, default: 0, set: v => Math.round(v * 100) / 100 },
  totalNetBalance: { type: Number, default: 0 }, 
  totalYouWillGive: { type: Number, default: 0 }, 
  totalYouWillGet: { type: Number, default: 0 }, 
  banks: [
    {
      bankName: { type: String, required: true, uppercase: true, trim: true },
      balance: { type: Number, default: 0, set: v => Math.round(v * 100) / 100 },
      totalIn: { type: Number, default: 0, set: v => Math.round(v * 100) / 100 },
      totalOut: { type: Number, default: 0, set: v => Math.round(v * 100) / 100 },
      isActive: { type: Boolean, default: true }, 
      lastSyncedAt: { type: Date, default: Date.now } 
    }
  ],
  currency: {  type: String,  default: 'INR', enum: ['INR', 'USD', 'EUR'] },
  status: { type: String,  default: 'active',  enum: ['active', 'suspended', 'frozen'] },
  isNegativeAllowed: { type: Boolean,  default: false },
  lastTransactionId: {  type: mongoose.Schema.Types.ObjectId, ref: 'NotificationLog' }
}, { 
  timestamps: true, 
  versionKey: false 
});


walletSchema.index({ userId: 1, "banks.bankName": 1 });

module.exports = mongoose.model('Wallet', walletSchema);