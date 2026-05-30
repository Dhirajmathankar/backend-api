const mongoose = require('mongoose');


const NotificationLogSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  activeTripId: { type: String, default: null, index: true },
  appPackage: { type: String, required: true },
  title: { type: String, default: "" },
  rawBody: { type: String, required: true },
  amount: { type: Number, default: 0 },
  merchant: { type: String, default: "Unknown" },
  senderName: { type: String, default: "Unknown Sender" },
  receiverName: {  type: String,    default: "Unknown Receiver"  },
  isGroupExpense: { type: Boolean, default: false },
  isTagged: { type: String, enum: ['clean', 'will-get', 'will-give'], default:'clean' },
  type: { type: String,  enum: ['credit', 'debit'], default: 'credit' },
  timestamp: { type: Date, default: Date.now },
  parsedData: {
    isFinancial: { type: Boolean, default: false, index: true }, // क्या यह पैसे से रिलेटेड है?
    bankName: { type: String, uppercase: true }, // 'AXIS', 'CBI', आदि
    amount: { type: Number, default: 0 },
    type: { type: String, enum: ['CREDIT', 'DEBIT', 'UNKNOWN'] },
    accountNumberTail: { type: String }, // e.g. '1234'
    transactionId: { type: String }, // UPI Ref या IMPS नंबर
    merchantName: { type: String, default: 'Unknown' } // Swiggy, Zomato, Kirana Store आदि
  },
  
  // खता/उधारी ट्रैकिंग के लिए टैगिंग केस
  isTagged: { type: String, enum: ['CLEAN', 'WILL-GET', 'WILL-GIVE'], default: 'CLEAN', index: true }, 
  taggedToMitraId: { type: mongoose.Schema.Types.ObjectId, ref: 'mitras', default: null }, // अगर किसी दोस्त पर टैग किया है
}, { timestamps: true });

module.exports = mongoose.model('NotificationLog', NotificationLogSchema);