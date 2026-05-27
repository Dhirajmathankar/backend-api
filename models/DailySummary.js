const mongoose = require('mongoose');

const DailySummarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  dateString: { 
    type: String, // फ़ॉर्मेट: "YYYY-MM-DD"
    required: true,
    index: true
  },
  
  // 💰 ऑनलाइन/सामान्य ट्रांजैक्शन्स
  totalCreditAmount: { type: Number, default: 0 }, // शुद्ध कमाई/आया हुआ पैसा
  totalDebitAmount: { type: Number, default: 0 },  // शुद्ध खर्च/गया हुआ पैसा
  
  // 🤝 उधारी ट्रैकिंग फ़ील्ड्स (Proper Separate Fields)
  totalYouWillGet: { 
    type: Number, 
    default: 0 // 🟢 'will-get' -> जो पैसा आज आपने किसी को उधार दिया (मार्केट से लेना है)
  },
  totalYouWillGive: { 
    type: Number, 
    default: 0 // 🔴 'will-give' -> जो उधार आज आपने किसी से लिया (मार्केट में देना है)
  },

  // 📝 ऑफलाइन बनाम ऑनलाइन काउंटर्स (फ्यूचर यूआई चार्ट्स के लिए)
  onlineTxnCount: { type: Number, default: 0 },
  offlineTxnCount: { type: Number, default: 0 },
  totalTransactionCount: { type: Number, default: 0 }, // कुल मिलाकर काउंट

  netSavings: { type: Number, default: 0 },
  topExpenseSource: { type: String, default: "N/A" },
  
  // उस दिन के सभी ट्रांजैक्शन्स (चाहे ऑनलाइन हों या ऑफलाइन मैन्युअल एंट्री)
  transactionsList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NotificationLog'
  }]
}, { timestamps: true });

DailySummarySchema.index({ userId: 1, dateString: 1 }, { unique: true });

module.exports = mongoose.model('DailySummary', DailySummarySchema);