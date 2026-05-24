const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const NotificationLog = require('../models/NotificationLog');
const bcrypt = require('bcryptjs');

// 🔒 JWT वेरिफिकेशन मिडिलवेयर
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: "Token missing" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bhaichara_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

// 🔑 1. लॉगिन एंडपॉइंट (JWT टोकन जनरेशन के साथ)
router.post('/login', async (req, res) => {
 try {
    const { email, password } = req.body;

    // 1. डेटाबेस से यूज़र निकालें
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "यूज़र नहीं मिला भाई!" });
    }

    // 2. मेथड कॉल करें (अगर स्टेप 1 सही है, तो यह एरर नहीं देगा)
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "गलत पासवर्ड!" });
    }

    // 3. टोकन जनरेशन लॉजिक...
    // res.status(200).json({ token, user });

  } catch (err) {
    process.processTicksAndRejections(err); // एरर हैंडलिंग
    res.status(500).json({ error: err.message });
  }
});

// 📊 2. होम स्क्रीन डेटा एंडपॉइंट (MongoDB से रीयल-टाइम कैलकुलेशन)
router.get('/dashboard-summary', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // MongoDB एग्रीगेशन पाइपलाइन: Total In (Credit) और Out (Debit) निकालने के लिए
    const stats = await NotificationLog.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalIn: { $sum: { $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0] } },
          totalOut: { $sum: { $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0] } }
        }
      }
    ]);

    // आज के ट्रांजैक्शन्स लिस्ट निकालना
    const recentTransactions = await NotificationLog.find({
      userId: userId,
      timestamp: { $gte: today }
    }).sort({ timestamp: -1 });

    const summary = stats[0] || { totalIn: 0, totalOut: 0 };

    res.status(200).json({
      totalBalance: 25480 + (summary.totalIn - summary.totalOut), // बेस अमाउंट + लाइव सिंक
      youWillGive: summary.totalOut,
      youWillGet: summary.totalIn,
      monthlyBudget: 20000,
      recentTransactions: recentTransactions
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 📝 3. नया यूजर रजिस्ट्रेशन एंडपॉइंट (Sign Up)
router.post('/signup', async (req, res) => {
  try {
    const { email, password, phone, activeTripId } = req.body;

    // मान लें कि आपके पास मोंगोज़ का User मॉडल है, यदि नहीं है तो हम ऑब्जेक्ट रिपॉन्स जनरेट कर रहे हैं
    const newUserPayload = {
      _id: "user_" + Math.random().toString(36).substr(2, 9), // डायनेमिक रैंडम आईडी
      email: email,
      phone: phone,
      activeTripId: activeTripId || "trip_trip_goa_2026"
    };

    // यहाँ पर JWT जनरेट कर रहे हैं ताकि साइनअप के तुरंत बाद यूजर लॉगिन स्टेट में आ जाये
    const token = jwt.sign(newUserPayload, process.env.JWT_SECRET || 'bhaichara_secret_key', { expiresIn: '30d' });

    console.log(`👤 New User Registered in DB: [${email}]`);
    return res.status(201).json({ token, user: newUserPayload });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;