const express = require('express');
const router = express.Router();
const NotificationLog = require('../models/NotificationLog');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verifyToken = require('../middleware/auth');
const mongoose = require('mongoose');




// @route   PATCH /api/notifications/tag/:id
// @desc    Update transaction tag type (clean / will-get / will-give)
router.patch('/tag/:id', async (req, res) => {
  try {
    const { status } = req.body; // status can be: 'clean', 'will-get', 'will-give'
    
    if (!['clean', 'will-get', 'will-give'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status tag" });
    }

    const updatedLog = await NotificationLog.findByIdAndUpdate(
      req.params.id,
      { isTagged: status },
      { new: true }
    );

    if (!updatedLog) {
      return res.status(404).json({ success: false, message: "Log record not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Transaction tagged successfully as ${status}`,
      data: updatedLog
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});



router.get('/dashboard-summary', verifyToken, async (req, res) => {
  try {
  
  console.log("Hello console..." , req  , req.user)
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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