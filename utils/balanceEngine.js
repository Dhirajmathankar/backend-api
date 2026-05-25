const mongoose = require('mongoose');
const Wallet = require('../models/Wallet');
const NotificationLog = require('../models/NotificationLog');

async function updateWalletBalance(userId) {
  try {
    if (!userId) {
      console.error("❌ Wallet Engine: userId missing or undefined!");
      return null;
    }

    // स्ट्रिंग और मोंगूज़ ObjectId दोनों को हैंडल करना
    const stringUserId = userId._id ? userId._id.toString() : userId.toString();
    const objectUserId = new mongoose.Types.ObjectId(stringUserId);

    // 📊 बैंक-वाइज एग्रीगेशन ($in का उपयोग ताकि दोनों आईडी टाइप मैच हो जाएं)
    const bankStats = await NotificationLog.aggregate([
      { 
        $match: { 
          userId: { $in: [stringUserId, objectUserId] },
          bankName: { $exists: true, $ne: null }
        } 
      },
      {
        $group: {
          _id: { $toUpper: { $trim: { input: "$bankName" } } }, // 🏦 केस-इन्सेंसिटिव ग्रुपिंग
          totalIn: { $sum: { $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0] } },
          totalOut: { $sum: { $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0] } }
        }
      }
    ]);

    let overallTotalBalance = 0;
    let overallYouWillGet = 0;
    let overallYouWillGive = 0;
    let banksBreakdown = [];

    // फ्लोटिंग पॉइंट एरर हैंडल करने के लिए यूटिलिटी फंक्शन
    const roundToTwo = (num) => Math.round(num * 100) / 100;

    if (bankStats && bankStats.length > 0) {
      banksBreakdown = bankStats.map(bank => {
        const currentBankBalance = roundToTwo(bank.totalIn - bank.totalOut);
        
        overallTotalBalance += currentBankBalance;
        overallYouWillGet += bank.totalIn;
        overallYouWillGive += bank.totalOut;

        return {
          bankName: bank._id,
          balance: currentBankBalance,
          totalIn: roundToTwo(bank.totalIn),
          totalOut: roundToTwo(bank.totalOut),
          isActive: true,
          lastSyncedAt: new Date()
        };
      });
    }

    // फाइनल ओवरऑल राउंडिंग
    overallTotalBalance = roundToTwo(overallTotalBalance);
    overallYouWillGet = roundToTwo(overallYouWillGet);
    overallYouWillGive = roundToTwo(overallYouWillGive);

    // 💾 वॉलेट कलेक्शन में अपसर्ट (Upsert) करना
    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId: objectUserId },
      {
        totalBalance: overallTotalBalance,
        youWillGet: overallYouWillGet,
        youWillGive: overallYouWillGive,
        banks: banksBreakdown,
        status: 'active'
      },
      { new: true, upsert: true }
    );

    console.log(`✅ Live Wallet Updated for User: ${stringUserId}`);
    return updatedWallet;

  } catch (err) {
    console.error("❌ Wallet balance compilation error:", err.message);
    throw err;
  }
}

module.exports = { updateWalletBalance };