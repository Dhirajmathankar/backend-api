const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true,
    index: true // ⚡ तेजी से सर्च करने के लिए इंडेक्सिंग जरूरी है
  },
  
  // 💰 ओवरऑल समरी फ़ील्ड्स
  totalBalance: { 
    type: Number, 
    default: 0,
    required: true,
    set: v => Math.round(v * 100) / 100 // 🎯 फ्लोटिंग पॉइंट एरर (e.g. 10.0000000001) से बचने के लिए 2 डेसिमल राउंडिंग
  },
  youWillGet: { type: Number, default: 0, set: v => Math.round(v * 100) / 100 },
  youWillGive: { type: Number, default: 0, set: v => Math.round(v * 100) / 100 },
  
  // 🏦 हर बैंक का विस्तृत हिसाब-किताब
  banks: [
    {
      bankName: { 
        type: String, 
        required: true, 
        uppercase: true, // 🔠 ताकि "sbi" और "SBI" अलग-अलग न बनें, हमेशा कंसिस्टेंट रहे
        trim: true 
      },
      balance: { type: Number, default: 0, set: v => Math.round(v * 100) / 100 },
      totalIn: { type: Number, default: 0, set: v => Math.round(v * 100) / 100 },
      totalOut: { type: Number, default: 0, set: v => Math.round(v * 100) / 100 },
      
      // 🌟 प्रोडक्शन के लिए नई फील्ड्स (बैंक वाइज)
      isActive: { type: Boolean, default: true }, // अगर यूजर किसी बैंक को डिसेबल/हाइड करना चाहे
      lastSyncedAt: { type: Date, default: Date.now } // इस पर्टिकुलर बैंक का आखिरी ट्रांजैक्शन कब हुआ था
    }
  ],

  // 🌍 मल्टी-करंसी सपोर्ट (रियल-वर्ल्ड ऐप्स में कल को काम आ सकता है)
  currency: { 
    type: String, 
    default: 'INR', 
    enum: ['INR', 'USD', 'EUR'] 
  },

  // 🔒 सिक्योरिटी और सेफ्टी फ़ील्ड्स (Most Critical for Production)
  status: { 
    type: String, 
    default: 'active', 
    enum: ['active', 'suspended', 'frozen'] // फ्रॉड डिटेक्ट होने पर वॉलेट फ्रीज करने के लिए
  },
  
  isNegativeAllowed: { 
    type: Boolean, 
    default: false // क्या अकाउंट बैलेंस 0 से नीचे (Minus में) जा सकता है?
  },

  lastTransactionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'NotificationLog' // आखिरी ट्रांजैक्शन कौन सा था, तुरंत ट्रैक करने के लिए
  }

}, { 
  timestamps: true, // createdAt और updatedAt ऑटोमैटिक आ जाएंगे
  versionKey: false // __v फ़ील्ड को हटा देगा जो अक्सर रिस्पॉन्स में क्लीन लुक खराब करती है
});

// ⚡ डेटाबेस लेवल पर परफॉरमेंस ऑप्टिमाइज़ेशन (Compound Indexing)
// जब आप बैंकों के अंदर सर्च या सॉर्ट करेंगे तो यह क्वेरी को सुपर फ़ास्ट बना देगा
walletSchema.index({ userId: 1, "banks.bankName": 1 });

module.exports = mongoose.model('Wallet', walletSchema);