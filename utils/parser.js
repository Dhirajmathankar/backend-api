/**
 * PhonePe/GPay/SMS से लाइव अमाउंट और मर्चेंट का नाम एक्सट्रैक्ट करने का पार्सर
 */
function parseNotificationText(text) {
  let amount = 0;
  let merchant = "Unknown";

  if (!text) return { amount, merchant };

  // ₹ या Rs. के बाद लिखे अमाउंट को निकालने के लिए Regex
  const amountRegex = /(?:Rs\.?|₹)\s*([\d,]+)/i;
  const matchAmount = text.match(amountRegex);
  if (matchAmount && matchAmount[1]) {
    amount = parseFloat(matchAmount[1].replace(/,/g, ''));
  }

  // "to Ramesh", "at Petrol Pump", "received from Amit" जैसे पैटर्न्स डिटेक्ट करना
  const merchantRegex = /(?:to|at|from|paid to)\s+([A-Za-z0-9\s]{3,20})/i;
  const matchMerchant = text.match(merchantRegex);
  if (matchMerchant && matchMerchant[1]) {
    merchant = matchMerchant[1].trim();
  }

  return { amount, merchant };
}

module.exports = { parseNotificationText };