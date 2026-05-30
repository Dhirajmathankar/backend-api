const Wallet = require('../models/Wallet');

exports.getWalletSnapshot = async (req, res) => {
  try {
    const userId = req.user._id; // JWT से प्राप्त यूजर आईडी

    // .lean() का इस्तेमाल मोंगोडीबी क्वेरी को 10 गुना फ़ास्ट बना देता है
    const wallet = await Wallet.findOne({ userId }).lean();
    
    if (!wallet) {
      return res.status(200).json({
        status: "success",
        data: { totalNetBalance: 0, totalYouWillGive: 0, totalYouWillGet: 0, banksBreakdown: [] }
      });
    }

    res.status(200).json({ status: "success", data: wallet });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};