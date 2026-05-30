const Wallet = require('../models/Wallet');
const DailySummary = require('../models/DailySummary');
const mongoose = require('mongoose');

class ParserService {
  /**
   * 🔍 SMS से बैंक का नाम डिटेक्ट करना
   */
  static extractBankName(title, body) {
    const fullText = `${title} ${body}`.toUpperCase();
    if (fullText.includes('AXIS')) return 'AXIS';
    if (fullText.includes('CENTRAL BANK') || fullText.includes('CBI')) return 'CBI';
    if (fullText.includes('HDFC')) return 'HDFC';
    if (fullText.includes('SBI')) return 'SBI';
    if (fullText.includes('PAYTM')) return 'PAYTM';
    return title ? title.replace(/[^a-zA-Z]/g, '').slice(-4).toUpperCase() : 'CASH';
  }

  /**
   * ⚡ रीयल-टाइम सिंगल-शॉट एटॉमिक ट्रांजैक्शन प्रोसेसर
   */
  static async processIncomingLog(userId, log) {
    const amount = Math.round(log.amount * 100) / 100;
    const bankName = this.extractBankName(log.title, log.rawBody);
    const isCredit = log.type === 'credit';
    const balanceDelta = isCredit ? amount : -amount;

    // --- 1. WALLET ATOMIC UPDATE ---
    // पहले चेक करें कि क्या यूजर के पास यह बैंक पहले से एरे में मौजूद है
    let wallet = await Wallet.findOneAndUpdate(
      { userId, "banksBreakdown.bankName": bankName },
      {
        $inc: {
          totalNetBalance: balanceDelta,
          "banksBreakdown.$.balance": balanceDelta,
          "banksBreakdown.$.totalIn": isCredit ? amount : 0,
          "banksBreakdown.$.totalOut": isCredit ? 0 : amount
        },
        $set: { "banksBreakdown.$.updatedAt": new Date() }
      },
      { new: true }
    );

    // अगर बैंक मौजूद नहीं था, तो उसे $push ऑपरेटर के साथ एरे में नया ऑब्जेक्ट बनाकर इन्सर्ट करें
    if (!wallet) {
      wallet = await Wallet.findOneAndUpdate(
        { userId },
        {
          $push: {
            banksBreakdown: {
              bankName,
              balance: balanceDelta,
              totalIn: isCredit ? amount : 0,
              totalOut: isCredit ? 0 : amount
            }
          },
          $inc: { totalNetBalance: balanceDelta }
        },
        { new: true, upsert: true }
      );
    }

    // --- 2. DAILY ANALYTICS AGGREGATION ENGINE ---
    const tzOffset = (new Date()).getTimezoneOffset() * 60000;
    const dateString = (new Date(Date.now() - tzOffset)).toISOString().split('T')[0];

    await DailySummary.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId), dateString },
      {
        $inc: {
          totalCreditAmount: isCredit ? amount : 0,
          totalDebitAmount: isCredit ? 0 : amount,
          onlineTxnCount: log.appPackage !== 'manual' ? 1 : 0,
          offlineTxnCount: log.appPackage === 'manual' ? 1 : 0,
          totalTransactionCount: 1,
          netSavings: balanceDelta
        },
        $set: { topExpenseSource: isCredit ? "INWARD" : (log.title || "EXPENSE") }
      },
      { upsert: true, new: true }
    );

    return { wallet, detectedBank: bankName };
  }
}

module.exports = ParserService;