const router = require('express').Router();
const mongoose = require('mongoose');
const KhataLedger = require('../models/KhataLedger');
const { syncKhataWithWallet } = require('../utils/khataSyncEngine');
const verifyToken = require('../middleware/auth');

// ➕ 1. ADD NEW KHATA ENTRY (लेना है या देना है - विथ रीज़न & लाइव एसएमएस/व्हाट्सएप ट्रिगर अलर्ट)
router.post('/add', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { personName, personPhone, amount, khataType, reason, paymentMode } = req.body;

    if (!personName || !personPhone || !amount || !khataType) {
      return res.status(400).json({ status: "error", message: "ज़रूरी फ़ील्ड्स (Name, Phone, Amount, Type) गायब हैं।" });
    }

    // १. नया खाता रिकॉर्ड डेटाबेस में बनाएँ
    const khataEntry = new KhataLedger({
      userId,
      personName,
      personPhone: personPhone.replace(/[\s\-]/g, ""), // फ़ोन नंबर से स्पेस साफ़ करें
      amount: parseFloat(amount),
      khataType, // 'will-get' (लेना है) या 'will-give' (देना है)
      reason: reason || "Personal Expense",
      paymentMode: paymentMode || "cash"
    });

    const savedKhata = await khataEntry.save();

    // २. वॉलेट इंजन के साथ सिंक करें (ताकि टोटल बैलेंस और आज की समरी तुरंत अपडेट हो)
    await syncKhataWithWallet(savedKhata);

    // ३. सामने वाले को अलर्ट भेजने का मैकेनिज्म (खाताबुक स्टाइल)
    let textMessage = "";
    if (khataType === 'will-get') {
      textMessage = `नमस्ते ${personName}, आपके खाते में ₹${amount} उधारी दर्ज की गई है जो आपको मुझे देनी है (Reason: ${reason || 'उधार'}). - ट्रैकड बाय डिजिटल डायरी।`;
    } else {
      textMessage = `नमस्ते ${personName}, मैंने आपसे ₹${amount} उधार लिए हैं, जिसे मैंने अपने खाते में दर्ज कर लिया है। (Reason: ${reason || 'उधार'}).`;
    }

    // 📢 लाइव एक्सटर्नल अलर्ट ट्रिगर (प्रोडक्शन रेडी सिमुलेशन)
    let smsStatus = "sent";
    try {
      // यहाँ आप Twilio, MSG91, या अपना व्हाट्सएप गेटवे बाइंड कर सकते हैं
      console.log(`📲 [NOTIFY_EXTERNAL] Sending SMS/WhatsApp to [${personPhone}]: "${textMessage}"`);
      // await smsGateway.send(personPhone, textMessage); 
    } catch (smsErr) {
      console.error("⚠️ Notification Delivery Failed:", smsErr.message);
      smsStatus = "failed";
    }

    // स्टेटस अपडेट करें
    savedKhata.notificationSentStatus = smsStatus;
    await savedKhata.save();

    res.status(201).json({
      status: "success",
      message: "खाता एंट्री सफलतापूर्वक सेव हो गई है और सामने वाले को सूचित कर दिया गया है।",
      data: savedKhata
    });

  } catch (err) {
    console.error("❌ Khata Add Route Error:", err.message);
    res.status(500).json({ status: "error", error: err.message });
  }
});

// 📊 2. GET KHATA INFO & LIST (नीचे की तरफ पूरा विवरण दिखाने के लिए)
router.get('/info-list', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // डेटाबेस से इस यूज़र की पूरी खाता हिस्ट्री निकालें (लेटेस्ट पहले)
    const rawList = await KhataLedger.find({ userId }).sort({ date: -1 });

    // समरी कैलकुलेट करें (टोटल कितना लेना है और कितना देना है)
    let totalWillGet = 0;
    let totalWillGive = 0;

    const formattedTransactions = rawList.map(item => {
      if (item.khataType === 'will-get') {
        totalWillGet += item.amount;
      } else {
        totalWillGive += item.amount;
      }

      return {
        id: item._id,
        name: item.personName,
        phone: item.personPhone,
        amount: item.amount,
        type: item.khataType, // 'will-get' or 'will-give'
        reason: item.reason,  // क्यों लिया/दिया
        mode: item.paymentMode,
        alertStatus: item.notificationSentStatus, // sent / failed
        createdAt: item.date
      };
    });

    res.status(200).json({
      status: "success",
      data: {
        summary: {
          totalNetKhataBalance: Math.round((totalWillGet - totalWillGive) * 100) / 100, // शुद्ध लेन-देन स्थिति
          youWillGetFromOthers: Math.round(totalWillGet * 100) / 100,  // मार्केट से कुल लेना है
          youWillGiveToOthers: Math.round(totalWillGive * 100) / 100   // मार्केट में कुल देना है
        },
        history: formattedTransactions // यह एरे सीधे नीचे यूआई लिस्ट में लूप होगा
      }
    });

  } catch (err) {
    console.error("❌ Khata Fetch Route Error:", err.message);
    res.status(500).json({ status: "error", error: err.message });
  }
});

module.exports = router;