const NotificationLog = require('../models/NotificationLog');
const ParserService = require('../services/parser.service');

// 📥 नया नोटिफिकेशन / SMS रिकॉर्ड इन्सर्ट करना (CRUD - Create)
exports.createTransaction = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, rawBody, amount, type, appPackage } = req.body;

    // सिर्फ क्रेडिट या डेबिट से जुड़े काम के मैसेज स्टोर करें
    if (type !== 'credit' && type !== 'debit') {
      return res.status(400).json({ status: "ignored", message: "Non-financial log ignored." });
    }

    const log = new NotificationLog({
      userId,
      title,
      rawBody,
      amount,
      type,
      appPackage: appPackage || 'manual'
    });
    await log.save();

    // कोर पार्सर सर्विस को कॉल करें जो रीयल-टाइम में वॉलेट और डेली समरी को सिंक करेगी
    const { wallet, detectedBank } = await ParserService.processIncomingLog(userId, log);

    // 🔌 SOCKET.IO EMIT: बिना यूआई रिफ्रेश किए फ्रंटएंड को अलर्ट भेजना
    if (global.io) {
      global.io.to(userId.toString()).emit('wallet-update', {
        totalNetBalance: wallet.totalNetBalance,
        banksBreakdown: wallet.banksBreakdown,
        newTx: {
          id: log._id,
          bankName: detectedBank,
          type: log.type,
          amount: log.amount,
          message: rawBody.split('\n')[0],
          time: log.createdAt
        }
      });
    }

    res.status(201).json({ status: "success", data: log });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// 📊 आज और पास्ट ट्रांजैक्शन का सेपरेटेड रिस्पॉन्स (CRUD - Read)
exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // दोनों डेटा सेट्स को पैरेलल चलाने के लिए Promise.all का उपयोग करें (फास्टेस्ट रिस्पॉन्स)
    const [todayLogs, pastLogs] = await Promise.all([
      NotificationLog.find({ userId, createdAt: { $gte: todayStart } }).sort({ createdAt: -1 }).lean(),
      NotificationLog.find({ userId, createdAt: { $lt: todayStart } }).sort({ createdAt: -1 }).limit(30).lean()
    ]);

    const formatter = (log) => ({
      id: log._id,
      bankName: ParserService.extractBankName(log.title, log.rawBody),
      type: log.type,
      amount: log.amount,
      message: log.rawBody ? log.rawBody.split('\n')[0] : "Manual Entry",
      time: log.createdAt
    });

    res.status(200).json({
      status: "success",
      data: {
        todayTransactions: todayLogs.map(formatter),
        pastTransactions: pastLogs.map(formatter)
      }
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};