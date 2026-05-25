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



router.get('/dashboard-summary', verifyToken, async (req, res) => {
  try {
	
	console.log("Hello console..." , req  , req.user)
	const userId = new mongoose.Types.ObjectId(req.user._id);
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// MongoDB एग्रीगेशन पाइपलाइन
	const stats = await NotificationLog.aggregate([
	  { $match: { userId: userId } }, // अब यह परफेक्ट मैच करेगा
	  {
		$group: {
		  _id: null,
		  totalIn: { $sum: { $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0] } },
		  totalOut: { $sum: { $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0] } }
		}
	  }
	]);
	console.log("THIS IS STATS OF THE NOTITIFICATION...")
	const recentTransactions = await NotificationLog.find({
	  userId: req.user._id, // नॉर्मल .find() में कास्टिंग की ज़रूरत नहीं होती
	  timestamp: { $gte: today }
	}).sort({ timestamp: -1 });

	const summary = stats[0] || { totalIn: 0, totalOut: 0 };

	res.status(200).json({
	  totalBalance: 25480 + (summary.totalIn - summary.totalOut),
	  youWillGive: summary.totalOut,
	  youWillGet: summary.totalIn,
	  monthlyBudget: 20000,
	  recentTransactions: recentTransactions
	});

  } catch (err) {
	res.status(500).json({ error: err.message });
  }
});



module.exports = router;