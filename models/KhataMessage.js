const mongoose = require('mongoose');

const KhataMessageSchema = new mongoose.Schema({
  // किस खता ट्रांजैक्शन/कांटेक्ट के बीच की चैट है (Phone-wise grouping keeps it ultra-fast)
  personPhone: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  
  sender: { type: String, enum: ['USER', 'CUSTOMER'], default: 'USER' },
  messageType: { type: String, enum: ['TEXT', 'KHATA_ENTRY'], default: 'TEXT' },
  
  // अगर टेक्स्ट मैसेज है
  text: { type: String, default: '' },
  
  // अगर डायरेक्ट चैट से लेनदेन की एंट्री मारी गई है
  khataDetails: {
    amount: { type: Number, default: 0 },
    type: { type: String, enum: ['will-get', 'will-give'] },
    reason: { type: String, default: 'Chit-chat entry' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('KhataMessage', KhataMessageSchema);