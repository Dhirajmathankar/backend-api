const mongoose = require('mongoose');



const dailySummaries = new mongoose.Schema(
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'users', required: true },
  dateString: { type: String, required: true }, // Format: 'YYYY-MM-DD'
  
  totalCreditAmount: { type: Number, default: 0 },
  totalDebitAmount: { type: Number, default: 0 },
  totalYouWillGet: { type: Number, default: 0 },  // उस दिन कितना उधार दिया
  totalYouWillGive: { type: Number, default: 0 }, // उस दिन कितना उधार लिया
  
  onlineTxnCount: { type: Number, default: 0 },
  offlineTxnCount: { type: Number, default: 0 },
  netSavings: { type: Number, default: 0 }, // (Credit - Debit)
  topExpenseSource: { type: String }, // e.g., "ZOMATO"
  
  createdAt: Date
}, { timestamps: true });

module.exports = mongoose.model('dailySummaries', dailySummaries);
