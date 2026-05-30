const router = require('express').Router();
const KhataMessage = require('../models/KhataMessage');
const Khata = require('../models/Wallet'); // आपका मुख्य वॉलेट/लेज़र सिंक मॉडल
const verifyToken = require('../middleware/auth');

// 📥 1. चैट हिस्ट्री फेच करने की एपीआई
router.get('/history/:phone', verifyToken, async (req, res) => {
  try {
	console.log("=================HELO GET")
    const messages = await KhataMessage.find({
      userId: req.user._id,
      personPhone: req.params.phone
    }).sort({ createdAt: 1 }).lean();

    res.status(200).json({ status: 'success', data: messages });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 📤 2. नया मैसेज या न्यू लेज़र एंट्री भेजने की एपीआई
router.post('/send', verifyToken, async (req, res) => {
  try {
	console.log("=================HELO POST")
    const { personPhone, messageType, text, amount, type, reason } = req.body;
    const userId = req.user._id;

    const newMessage = new KhataMessage({
      userId,
      personPhone,
      messageType,
      sender: 'USER',
      text: messageType === 'TEXT' ? text : '',
      khataDetails: messageType === 'KHATA_ENTRY' ? { amount, type, reason } : undefined
    });

    await newMessage.save();

    // 💥 रीयल-टाइम सॉकेट ब्रॉडकास्ट (व्हाट्सएप की तरह लाइव रेंडर होगा)
    if (global.io) {
      global.io.to(userId.toString()).emit('new-chat-msg', newMessage);
    }

    res.status(201).json({ status: 'success', data: newMessage });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;