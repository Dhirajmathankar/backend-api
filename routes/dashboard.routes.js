const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Trip = require('../models/Trip');
const Wallet = require('../models/Wallet');
const Khata = require('../models/Khata');
const NotificationLog = require('../models/NotificationLog');
const { updateWalletBalance } = require('../utils/balanceEngine');
const verifyToken = require('../middleware/auth');

// 📊 होम स्क्रीन का संपूर्ण डेटा (Today's Transactions + Live Wallet Breakdown)
router.get('/summary', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔄 प्रोडक्शन बेस्ट प्रैक्टिस: हर बार लाइव डेटा कैलकुलेट करके वॉलेट सिंक करें
    const wallet = await updateWalletBalance(userId);

    // 🚗 एक्टिव ट्रिप और उसके मेंबर्स की जानकारी निकालें
    const activeTrip = await Trip.findOne({ 
      $or: [{ createdBy: userId }, { members: userId }], 
      isActive: true 
    }).populate('members', 'fullname email phone');

    // 🕒 आज के सभी ट्रांजैक्शन्स (Filter from 12:00 AM of today)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // नोट: अगर आपकी कलेक्शन में 'timestamp' की जगह 'createdAt' है, तो इसे बदल लें
    const todayTransactions = await NotificationLog.find({
      userId: userId.toString(),
      createdAt: { $gte: todayStart } 
    }).sort({ createdAt: -1 });

    // 🎯 रियल-वर्ल्ड क्लीन एपीआई रिस्पॉन्स स्ट्रक्चर
    res.status(200).json({
      status: "success",
      timestamp: new Date(),
      data: {
        walletSummary: {
          totalBalance: wallet ? wallet.totalBalance : 0,
          youWillGive: wallet ? wallet.youWillGive : 0,
          youWillGet: wallet ? wallet.youWillGet : 0,
          currency: wallet ? wallet.currency || 'INR' : 'INR',
          status: wallet ? wallet.status || 'active' : 'active',
          totalActiveBanks: wallet ? wallet.banks.length : 0,
          // 🔥 अब यह एरे फ्रंटएंड पर बैंक वाइज यूआई कार्ड्स (SBI, HDFC) बनाने में मदद करेगा
          banksBreakdown: wallet ? wallet.banks : []
        },
        activeTrip: activeTrip ? {
          id: activeTrip._id,
          tripName: activeTrip.tripName,
          budget: activeTrip.budget,
          membersCount: activeTrip.members.length,
          membersList: activeTrip.members
        } : null,
        todayTransactions: todayTransactions.map(log => ({
          id: log._id,
          bankName: log.bankName ? log.bankName.toUpperCase() : 'CASH',
          type: log.type, // credit / debit
          amount: log.amount,
          message: log.message,
          time: log.createdAt
        }))
      }
    });

  } catch (err) {
    console.error("❌ Dashboard Summary Route Error:", err.message);
    res.status(500).json({ status: "error", error: err.message });
  }
});

// ✈️ 2. नया ट्रिप बनाएं (मल्टीपल यूज़र्स/दोस्तों को जोड़कर)
router.post('/create-trip', verifyToken, async (req, res) => {
  try {
    const { tripName, destination, budget, memberIds } = req.body;

    // सुरक्षा के लिए पुराने एक्टिव ट्रिप्स को क्लोज करें
    await Trip.updateMany({ createdBy: req.user._id }, { isActive: false });

    // मेंबर्स लिस्ट में खुद क्रिएटर को भी शामिल करें
    const allMembers = Array.isArray(memberIds) ? [...memberIds] : [];
    if (!allMembers.includes(req.user._id)) {
      allMembers.push(req.user._id);
    }

    const newTrip = new Trip({
      tripName,
      destination,
      budget,
      createdBy: req.user._id,
      members: allMembers
    });

    await newTrip.save();
    res.status(201).json({ message: "🚀 ट्रिप सफलतापूर्वक शुरू हो गया है!", trip: newTrip });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📝 3. खाता एंट्री (ऑफलाइन नकद भुगतान या स्प्लिट जोड़ने के लिए)
router.post('/add-khata-entry', verifyToken, async (req, res) => {
  try {
    const { amount, merchant, paymentMode, tripId, splitUsers } = req.body;

    // 1. नोटिफिकेशन लॉग में एंट्री बनाएं ताकि होम स्क्रीन पर सिंक दिखे
    const manualLog = new NotificationLog({
      userId: req.user._id.toString(),
      activeTripId: tripId || null,
      appPackage: paymentMode === 'offline' ? 'manual.khata.cash' : 'manual.khata.online',
      title: paymentMode === 'offline' ? 'Offline Cash Paid' : 'Manual Online Paid',
      rawBody: `₹${amount} paid to ${merchant} via ${paymentMode}`,
      amount: Number(amount),
      merchant: merchant,
      type: 'debit', // खर्च है
      isGroupExpense: !!tripId
    });
    await manualLog.save();

    // 2. खाता लेजर एंट्री सेव करें
    const khataRecord = new Khata({
      tripId: tripId || null,
      paidBy: req.user._id,
      amount: Number(amount),
      merchant,
      paymentMode,
      splitBetween: splitUsers || [{ userId: req.user._id, share: Number(amount) }]
    });
    await khataRecord.save();

    // 3. लाइव वॉलेट री-कैलकुलेट करें
    await updateWalletBalance(req.user._id);

    // 📢 सॉकेट के जरिए एंगुलर स्क्रीन पर रीयल-टाइम अपडेट ट्रिगर करें
    const io = req.app.get('socketio');
    if (io) {
      if (tripId) {
        io.to(tripId).emit('ui_notification_update', manualLog);
      } else {
        io.to(req.user._id.toString()).emit('ui_notification_update', manualLog);
      }
    }

    res.status(201).json({ message: "📝 खाता बही में एंट्री दर्ज हो गई है", log: manualLog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;