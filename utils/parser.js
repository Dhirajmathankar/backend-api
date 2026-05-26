/**
 * यूनिवर्सल बैंक एसएमएस पार्सर (कहाँ से आए और कहाँ गए - नाम ट्रैकर के साथ)
 * @param {string} text - नोटिफिकेशन या एसएमएस का कच्चा टेक्स्ट (rawBody)
 * @returns {object} { amount: number, merchant: string, senderName: string, receiverName: string }
 */
function parseNotificationText(text) {
  let amount = 0;
  let merchant = "Unknown";
  let senderName = "Unknown Sender";   // 📥 कहाँ से आए
  let receiverName = "Unknown Receiver"; // 📤 कहाँ जा रहे हैं

  if (!text || typeof text !== "string") {
    return { amount, merchant, senderName, receiverName };
  }

  // 🧹 1. टेक्स्ट को नॉर्मलाइज़ करें
  const cleanText = text.replace(/\s+/g, " ").trim();
  const lowerText = cleanText.toLowerCase();

  // 💰 2. AMOUNT EXTRACTION
  const amountRegex = /(?:INR|Rs\.?|₹|debited|credited)\s*([\d,]+\.?\d*)/i;
  let amountMatch = cleanText.match(amountRegex);

  if (!amountMatch) {
    const fallbackAmountRegex = /(?:\b)([\d,]+\.\d{2})(?:\b)/;
    amountMatch = cleanText.match(fallbackAmountRegex);
  }

  if (amountMatch && amountMatch[1]) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ""));
  }

  // 🔄 डेबिट और क्रेडिट का पता लगाएं (Direction Checker)
  const isDebit = lowerText.includes('sent') || lowerText.includes('debited') || lowerText.includes('paid');

  // 🏢 3. DYNAMIC NAME EXTRACTION (Sender & Receiver)

  // केस A: विशिष्ट UPI स्ट्रक्चर (जैसे: UPI/P2A/099560191886/RAHUL DESHMUKH)
  const upiPattern = /UPI\/[A-Z0-9_.]+\/\d+\/([^/]+)/i;
  const upiMatch = cleanText.match(upiPattern);

  if (upiMatch && upiMatch[1]) {
    const detectedName = upiMatch[1].trim();
    if (isDebit) {
      receiverName = detectedName;
      senderName = "My Account"; // क्योंकि पैसे मेरे पास से गए हैं
      merchant = receiverName;
    } else {
      senderName = detectedName;
      receiverName = "My Account"; // क्योंकि पैसे मुझे मिले हैं
      merchant = senderName;
    }
  } 
  // केस B: सरकारी योजनाएं (PM Kisan, Samman Nidhi, DBT)
  else if (lowerText.includes("samman") || lowerText.includes("nidhi") || lowerText.includes("dbt") || lowerText.includes("pm-kisan")) {
    senderName = lowerText.includes("samman") || lowerText.includes("nidhi") ? "PM Samman Nidhi Yojana" : "Govt DBT Benefit";
    receiverName = "My Account";
    merchant = senderName;
  }
  // केस C: सामान्य बैंकिंग कीवर्ड्स आधारित एक्सट्रैक्शन
  else {
    // 📤 अगर पैसे डेबited/Paid हुए हैं (कहाँ जा रहे हैं खोजें)
    if (isDebit) {
      senderName = "My Account";
      const receiverPatterns = [
        /(?:paid to|transferred to|spent on|at|to)\s+([^.]+)/i,
        /vpa\s+([^.]+)/i
      ];
      for (const pattern of receiverPatterns) {
        const match = cleanText.match(pattern);
        if (match && match[1]) {
          receiverName = match[1].trim();
          break;
        }
      }
      merchant = receiverName !== "Unknown Receiver" ? receiverName : "Other Merchant";
    } 
    // 📥 अगर पैसे Credited/Received हुए हैं (कहाँ से आए खोजें)
    else {
      receiverName = "My Account";
      const senderPatterns = [
        /(?:by|received from|deposited by|transfer from)\s+([^.]+)/i,
        /from\s+([^.]+)/i
      ];
      for (const pattern of senderPatterns) {
        const match = cleanText.match(pattern);
        if (match && match[1]) {
          senderName = match[1].trim();
          break;
        }
      }
      merchant = senderName !== "Unknown Sender" ? senderName : "Inward Remittance";
    }
  }

  // 🛑 4. CLEANING GATEKEEPER (फ़ालतू कीवर्ड्स को नामों में से साफ़ करना)
  const cleanFinalName = (name) => {
    let n = name.split("\n")[0].trim(); // पहली लाइन ही लें
    n = n.replace(/(not you|sms block|a\/c no|ref no|\d{10,}).*/i, ""); // अलर्ट मैसेज और नंबर हटाएं
    n = n.replace(/[\s\-\.,\/]+$/, "").trim(); // आख़िरी के सिम्बल्स साफ़ करें
    return n;
  };

  senderName = cleanFinalName(senderName);
  receiverName = cleanFinalName(receiverName);
  merchant = cleanFinalName(merchant);

  // यदि सफ़ाई के बाद नाम खाली हो गए हों तो फॉलबैक सेट करें
  if (!senderName || senderName.length === 0) senderName = isDebit ? "My Account" : "Unknown Sender";
  if (!receiverName || receiverName.length === 0) receiverName = isDebit ? "Unknown Receiver" : "My Account";
  if (!merchant || merchant.length === 0) merchant = isDebit ? receiverName : senderName;

  // स्कीमा लेंथ लिमिटेशन (Max 50 characters)
  if (merchant.length > 50) merchant = merchant.substring(0, 50);
  if (senderName.length > 50) senderName = senderName.substring(0, 50);
  if (receiverName.length > 50) receiverName = receiverName.substring(0, 50);

  return {
    amount: isNaN(amount) ? 0 : amount,
    merchant,
    senderName,
    receiverName
  };
}

module.exports = { parseNotificationText };