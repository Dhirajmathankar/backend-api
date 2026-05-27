// const mongoose = require('mongoose');
// const Wallet = require('../models/Wallet');
// const NotificationLog = require('../models/NotificationLog');

// async function updateWalletBalance(userId) {
//   try {
//     if (!userId) {
//       console.error("❌ Wallet Engine: userId missing or undefined!");
//       return null;
//     }

//     // स्ट्रिंग और मोंगूज़ ObjectId दोनों को हैंडल करना
//     const stringUserId = userId._id ? userId._id.toString() : userId.toString();
//     const objectUserId = new mongoose.Types.ObjectId(stringUserId);

//     // 📊 बैंक-वाइज एग्रीगेशन ($in का उपयोग ताकि दोनों आईडी टाइप मैच हो जाएं)
//     const bankStats = await NotificationLog.aggregate([
//       { 
//         $match: { 
//           userId: { $in: [stringUserId, objectUserId] },
//           // bankName: { $exists: true, $ne: null }
//         } 
//       },
//       {
//         $group: {
//           _id: { $toUpper: { $trim: { input: "$bankName" } } }, // 🏦 केस-इन्सेंसिटिव ग्रुपिंग
//           totalIn: { $sum: { $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0] } },
//           totalOut: { $sum: { $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0] } }
//         }
//       }
//     ]);

//     let overallTotalBalance = 0;
//     let overallYouWillGet = 0;
//     let overallYouWillGive = 0;
//     let banksBreakdown = [];

//     // फ्लोटिंग पॉइंट एरर हैंडल करने के लिए यूटिलिटी फंक्शन
//     const roundToTwo = (num) => Math.round(num * 100) / 100;
//     console.log("===========================, ", bankStats)

//     if (bankStats && bankStats.length > 0) {
//       banksBreakdown = bankStats.map(bank => {
//         const currentBankBalance = roundToTwo(bank.totalIn - bank.totalOut);
        
//         overallTotalBalance += currentBankBalance;
//         overallYouWillGet += bank.totalIn;
//         overallYouWillGive += bank.totalOut;

//         return {
//           bankName: bank._id,
//           balance: currentBankBalance,
//           totalIn: roundToTwo(bank.totalIn),
//           totalOut: roundToTwo(bank.totalOut),
//           isActive: true,
//           lastSyncedAt: new Date()
//         };
//       });
//     }

//     // फाइनल ओवरऑल राउंडिंग
//     overallTotalBalance = roundToTwo(overallTotalBalance);
//     overallYouWillGet = roundToTwo(overallYouWillGet);
//     overallYouWillGive = roundToTwo(overallYouWillGive);

//     // 💾 वॉलेट कलेक्शन में अपसर्ट (Upsert) करना
//     const updatedWallet = await Wallet.findOneAndUpdate(
//       { userId: objectUserId },
//       {
//         totalBalance: overallTotalBalance,
//         youWillGet: overallYouWillGet,
//         youWillGive: overallYouWillGive,
//         banks: banksBreakdown,
//         status: 'active'
//       },
//       { new: true, upsert: true }
//     );

//     console.log(`✅ Live Wallet Updated for User: ${stringUserId}`);
//     return updatedWallet;

//   } catch (err) {
//     console.error("❌ Wallet balance compilation error:", err.message);
//     throw err;
//   }
// }

// module.exports = { updateWalletBalance };



const mongoose = require('mongoose');
const Wallet = require('../models/Wallet');
const NotificationLog = require('../models/NotificationLog');

/**
 * वॉलेट बैलेंस कम्पाइलर इंजन - बैंक वाइज़ सेपरेट मैनेजमेंट
 * @param {string} userId - यूजर आईडी
 * @param {object} [liveTxn] - वर्तमान में आया हुआ लाइव ट्रांजैक्शन ऑब्जेक्ट (Optional)
 */
async function updateWalletBalance(userId, liveTxn = null) {
  try {
    if (!userId) return null;

    const stringUserId = userId._id ? userId._id.toString() : userId.toString();
    const objectUserId = new mongoose.Types.ObjectId(stringUserId);
    const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

    // 1. डेटाबेस से मौजूदा वॉलेट निकालें या नया बनाएँ
    let wallet = await Wallet.findOne({ userId: objectUserId });
    if (!wallet) {
      wallet = new Wallet({ userId: objectUserId, totalBalance: 0, banks: [] });
    }

    // 2. उधारी (isTagged: 'will-get' / 'will-give') का ऑल-ओवर एग्रीगेशन निकालें
    const debtStats = await NotificationLog.aggregate([
      { $match: { userId: stringUserId } },
      {
        $group: {
          _id: null,
          willGet: { $sum: { $cond: [{ $eq: ["$isTagged", "will-get"] }, "$amount", 0] } },
          willGive: { $sum: { $cond: [{ $eq: ["$isTagged", "will-give"] }, "$amount", 0] } }
        }
      }
    ]);

    if (debtStats && debtStats.length > 0) {
      wallet.youWillGet = round(debtStats[0].willGet);
      wallet.youWillGive = round(debtStats[0].willGive);
    }

    // 3. लाइव ट्रांजैक्शन के आधार पर विशिष्ट बैंक का सेपरेट कैलकुलेशन
    if (liveTxn && liveTxn.bankName) {
      const bName = liveTxn.bankName.toUpperCase();
      
      // देखें कि क्या यह बैंक पहले से वॉलेट के अंदर एरे में मौजूद है?
      let bankIndex = wallet.banks.findIndex(b => b.bankName === bName);

      if (bankIndex === -1) {
        // नया बैंक एंट्री इन्सर्ट करें
        let initialBalance = 0;
        if (liveTxn.bankBalance !== null) {
          initialBalance = liveTxn.bankBalance;
        } else {
          initialBalance = liveTxn.type === 'credit' ? liveTxn.amount : -liveTxn.amount;
        }

        wallet.banks.push({
          bankName: bName,
          balance: round(initialBalance),
          totalIn: liveTxn.type === 'credit' ? round(liveTxn.amount) : 0,
          totalOut: liveTxn.type === 'debit' ? round(liveTxn.amount) : 0,
          isActive: true,
          lastSyncedAt: new Date()
        });
      } else {
        // पुराना बैंक रिकॉर्ड अपडेट करें (बिना दूसरे बैंकों को डिस्टर्ब किए)
        let currentBank = wallet.banks[bankIndex];

        if (liveTxn.type === 'credit') {
          currentBank.totalIn = round(currentBank.totalIn + liveTxn.amount);
        } else {
          currentBank.totalOut = round(currentBank.totalOut + liveTxn.amount);
        }

        // 🌟 अगर मैसेज में डायरेक्ट कुल बैलेंस (जैसे सेंट्रल बैंक) आया है, तो ओवरराइड करें
        if (liveTxn.bankBalance !== null) {
          currentBank.balance = round(liveTxn.bankBalance);
        } else {
          // अगर लाइव बैलेंस एसएमएस में नहीं है (जैसे एक्सिस बैंक), तो पुराने बैलेंस में जोड़ें/घटाएं
          if (liveTxn.type === 'credit') {
            currentBank.balance = round(currentBank.balance + liveTxn.amount);
          } else {
            currentBank.balance = round(currentBank.balance - liveTxn.amount);
          }
        }
        
        currentBank.lastSyncedAt = new Date();
        wallet.banks[bankIndex] = currentBank;
      }
    }

    // 4. सभी बैंकों के व्यक्तिगत बैलेंस का सम (योग) करके ओवरऑल totalBalance निकालें
    let finalTotalBalance = 0;
    wallet.banks.forEach(b => {
      if (b.isActive) {
        finalTotalBalance += b.balance;
      }
    });
    wallet.totalBalance = round(finalTotalBalance);

    // 5. अपडेटेड डेटा को मोंगूज़ में सेव करें
    const savedWallet = await wallet.save();
    return savedWallet.toObject();

  } catch (err) {
    console.error("❌ Wallet balance compilation error:", err.message);
    throw err;
  }
}

module.exports = { updateWalletBalance };