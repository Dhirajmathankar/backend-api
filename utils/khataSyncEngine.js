const NotificationLog = require('../models/NotificationLog');
// ध्यान दें: अगर balanceEngine आपके utils फ़ोल्डर में ही है, तो पाथ './balanceEngine' रहेगा
const { updateWalletBalance } = require('./balanceEngine'); 

/**
 * खाता टैब की एंट्री को मुख्य ट्रांजैक्शन लॉग और वॉलेट समरी के साथ लिंक करना
 */
async function syncKhataWithWallet(khataRecord) {
  try {
    // खाता एंट्री को नोटिफिकेशन लॉग के रूप में रिफ्लेक्ट करें (ताकि समरी रूट इसे पकड़ सके)
    const offlineLog = new NotificationLog({
      userId: khataRecord.userId.toString(),
      appPackage: "manual", // ऑफलाइन मैनुअल एंट्री पहचान
      title: khataRecord.paymentMode === 'cash' ? "CASH KHATA" : "ONLINE KHATA",
      rawBody: `${khataRecord.khataType === 'will-get' ? 'उधार दिया' : 'उधार लिया'} to ${khataRecord.personName}. Reason: ${khataRecord.reason}`,
      amount: khataRecord.amount,
      merchant: khataRecord.personName,
      senderName: khataRecord.khataType === 'will-get' ? "My Account" : khataRecord.personName,
      receiverName: khataRecord.khataType === 'will-get' ? khataRecord.personName : "My Account",
      type: khataRecord.khataType === 'will-get' ? 'debit' : 'credit', // पैसा देना = डेबिट, पैसा लेना = क्रेडिट
      isTagged: khataRecord.khataType, // 'will-get' या 'will-give'
      isGroupExpense: false
    });

    await offlineLog.save();
    
    // लाइव वॉलेट समरी को रिकैलकुलेट करें (बिना पुराना बैलेंस बिगाड़े)
    await updateWalletBalance(khataRecord.userId);
    console.log(`📊 [KHATA_SYNC_SUCCESS] Wallet balances compiled via Khata entry.`);
    
    return offlineLog;
  } catch (err) {
    console.error("❌ Error syncing Khata entry to Wallet:", err.message);
    throw err;
  }
}

module.exports = { syncKhataWithWallet };