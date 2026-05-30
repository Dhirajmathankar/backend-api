// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const cors = require("cors");
// const path = require('path');

// dotenv.config();
// connectDB();

// const app = express();
// // app.use(express.json());
// // app.use(cors());
// // app.use(express.json({ limit: '50mb' }));
// // app.use(express.urlencoded({ limit: '50mb', extended: true }));

// app.use(cors());
// app.use(express.json({ limit: '50mb' })); 
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

// // 2. IMAGE SAVE DIRECTORY
// const UPLOAD_DIR = process?.env?.UPLOAD_DIR || "D:/Project New/APP_LOGIN_PAGE/ALL-IMAGE-PROJECT";

// app.get("/", (req, res) => {
//   res.send("Backend API is running...");
// });

// app.use("/api/auth", require("./routes/auth.routes"));

// const vendorRoutes = require("./routes/vendor.routes");
// app.use("/api/vendors", vendorRoutes);
// const userProfileRoute = require("./routes/profile-user-vender.routes");
// app.use("/api/user-profile", userProfileRoute);
// const permissionRoutes = require('./routes/permissions.routes');
// app.use('/api/permissions', permissionRoutes);

// const card = require('./routes/card.routes');
// app.use('/api/card', permissionRoutes);

// const venues = require('./routes/venue.routes');
// app.use('/api/venues/', venues);

// const emailRoutes = require('./routes/email.routes');

// app.use('/api/email', emailRoutes);

// const emailService = require('./services/email.service');

// app.use('/api/chat', require('./routes/chat.routes'));


// // (async () => {
// //   try {
// //     await emailService.sendMail({
// //       to: 'dhirajmathankar@gmail.com',
// //       subject: 'Direct Test Email',
// //       message: 'Email service working without API endpoint 🚀'
// //     });
// //     console.log('✅ Direct email test successful');
// //   } catch (err) {
// //     console.error('❌ Direct email test failed:', err.message);
// //   }
// // })();

// // THIS IS FOR THE USER PAYMENT NOTIFICATION ROUTE THERE IM HANDLING THIS FUNCTIONALITY
// app.use('/api/notifications', require('./routes/notification.routes'));

// // const path = require('path');

// // Sabse safe tarika: Direct absolute path use karein
// const IMAGES_FOLDER = "D:/Project New/APP_LOGIN_PAGE/ALL-IMAGE-PROJECT";

// // Express ko batayein ki is folder ki files ko /images URL par serve kare
// app.use('/images', express.static(IMAGES_FOLDER));

// // Check karne ke liye ki server sahi folder dekh raha hai
// console.log("Images are being served from:", IMAGES_FOLDER);



// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



// THIS IS NEW UPDATED CODE ... 


// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const cors = require("cors");
// const path = require('path');
// const http = require('http'); // 🔥 सॉकेट सर्वर के लिए http मॉड्यूल जोड़ा

// dotenv.config();
// connectDB();

// const app = express();
// // app.use(express.json());
// // app.use(cors());
// // app.use(express.json({ limit: '50mb' }));
// // app.use(express.urlencoded({ limit: '50mb', extended: true }));

// app.use(cors());
// app.use(express.json({ limit: '50mb' })); 
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

// // ⚡ 1. CREATE HTTP SERVER FOR SOCKET.IO
// const server = http.createServer(app); 
// const io = require('socket.io')(server, {
//   cors: {
//     origin: "*", // प्रोडक्शन में इसे अपने एंगुलर ऐप के यूआरएल से रिप्लेस कर सकते हैं
//     methods: ["GET", "POST"]
//   }
// });

// // 2. IMAGE SAVE DIRECTORY
// const UPLOAD_DIR = process?.env?.UPLOAD_DIR || "D:/Project New/APP_LOGIN_PAGE/ALL-IMAGE-PROJECT";

// app.get("/", (req, res) => {
//   res.send("Backend API is running...");
// });

// app.use("/api/auth", require("./routes/auth.routes"));

// const vendorRoutes = require("./routes/vendor.routes");
// app.use("/api/vendors", vendorRoutes);
// const userProfileRoute = require("./routes/profile-user-vender.routes");
// app.use("/api/user-profile", userProfileRoute);
// const permissionRoutes = require('./routes/permissions.routes');
// app.use('/api/permissions', permissionRoutes);

// const card = require('./routes/card.routes');
// app.use('/api/card', permissionRoutes);

// const venues = require('./routes/venue.routes');
// app.use('/api/venues/', venues);

// const emailRoutes = require('./routes/email.routes');

// app.use('/api/email', emailRoutes);

// const emailService = require('./services/email.service');

// app.use('/api/chat', require('./routes/chat.routes'));


// // (async () => {
// //   try {
// //     await emailService.sendMail({
// //       to: 'dhirajmathankar@gmail.com',
// //       subject: 'Direct Test Email',
// //       message: 'Email service working without API endpoint 🚀'
// //     });
// //     console.log('✅ Direct email test successful');
// //   } catch (err) {
// //     console.error('❌ Direct email test failed:', err.message);
// //   }
// // })();

// // THIS IS FOR THE USER PAYMENT NOTIFICATION ROUTE THERE IM HANDLING THIS FUNCTIONALITY
// app.use('/api/notifications', require('./routes/notification.routes'));

// // const path = require('path');

// // Sabse safe tarika: Direct absolute path use karein
// const IMAGES_FOLDER = "D:/Project New/APP_LOGIN_PAGE/ALL-IMAGE-PROJECT";

// // Express ko batayein ki is folder ki files ko /images URL par serve kare
// app.use('/images', express.static(IMAGES_FOLDER));

// // Check karne ke liye ki server sahi folder dekh raha hai
// console.log("Images are being served from:", IMAGES_FOLDER);


// // 🌐 3. SMART MULTI-USER SOCKET.IO LOGIC INTEGRATION
// const NotificationLog = require('./models/NotificationLog');
// const { parseNotificationText } = require('./utils/parser');

// io.on("connection", (socket) => {
//   // एंड्रॉइड ऐप और वेब ऐप से क्रेडेंशियल्स कैप्चर करना
//   const { userId, activeTripId } = socket.handshake.auth;

//   if (userId) {
//     // यूज़र को उसके यूनिक प्राइवेट रूम में जॉइन करवाएं
//     socket.join(`user_${userId}`);
//     console.log(`👤 User Connected: ${userId} attached to private room [user_${userId}]`);

//     // अगर कोई एक्टिव ट्रिप असाइंड है, तो ट्रिप वाले रूम में भी डालो
//     if (activeTripId) {
//       socket.join(`trip_${activeTripId}`);
//       console.log(`✈️ User ${userId} joined Group Trip Room [trip_${activeTripId}]`);
//     }
//   }

//   // फ्रंटएंड (Angular) से डायनेमिकली ट्रिप रूम स्विच करने का हैंडलर
//   socket.on("join_trip_room", ({ tripId }) => {
//     if (tripId) {
//       socket.join(`trip_${tripId}`);
//       console.log(`🔄 Socket context switched to Trip Room: trip_${tripId}`);
//     }
//   });

//   // 📥 एंड्रॉइड ऐप से आने वाला लाइव नोटिफिकेशन ट्रिगर इवेंट
//   socket.on("live_notification_trigger", async (data) => {
//     try {
//       console.log(`📥 Live Pay Notification Captured for User [${userId}]:`, data.body);

//       // टेक्स्ट मैसेज में से अमाउंट और मर्चेंट का नाम फिल्टर करना (Regex Parser)
//       const parsedInfo = parseNotificationText(data.body);

//       // 💾 MongoDB में एंट्री को प्रॉपर स्टोर करना
//       const newLog = new NotificationLog({
//         userId: userId,
//         activeTripId: activeTripId || null,
//         appPackage: data.appPackage,
//         title: data.title,
//         rawBody: data.body,
//         amount: parsedInfo.amount,
//         merchant: parsedInfo.merchant,
//         isGroupExpense: !!activeTripId,
//         timestamp: data.timestamp || Date.now()
//       });

//       const savedLog = await newLog.save();
//       console.log("💾 Notification Data successfully backed up in MongoDB!");

//       // पेलोड जो एंगुलर फ्रंटएंड को भेजा जाएगा
//       const uiPayload = {
//         logId: savedLog._id,
//         appPackage: savedLog.appPackage,
//         title: savedLog.title,
//         rawBody: savedLog.rawBody,
//         amount: savedLog.amount,
//         merchant: savedLog.merchant,
//         timestamp: savedLog.timestamp,
//         isGroupExpense: savedLog.isGroupExpense
//       };

//       // 📢 लाइव ब्रॉडकास्ट (सुरक्षित रूप से केवल संबंधित कमरे में)
//       if (activeTripId) {
//         // पूरे ग्रुप के दोस्तों को एक साथ सिंक करें
//         io.to(`trip_${activeTripId}`).emit("ui_notification_update", uiPayload);
//         console.log(`📢 Group Room (trip_${activeTripId}) updated live!`);
//       } else {
//         // सिर्फ उस सिंगल यूज़र की वेब स्क्रीन पर सेंड करें
//         io.to(`user_${userId}`).emit("ui_notification_update", uiPayload);
//         console.log(`🔒 Private User Screen (user_${userId}) updated live!`);
//       }

//     } catch (err) {
//       console.error("❌ Notification interception failed:", err.message);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log(`🔌 Socket connection closed for user: ${userId}`);
//   });
// });



// const PORT = process.env.PORT || 5000;
// // 🚨 नोट: सॉकेट कनेक्टिविटी के लिए अब ऐप को 'server.listen' के ज़रिये रन करना ज़रूरी है, 'app.listen' से नहीं।
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




// THIS IS NEW NEW UPDATED CODE AND FINAL STRUCTURE  





// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const cors = require("cors");
// const path = require('path');
// const http = require('http'); // ⚡ सॉकेट सर्वर के लिए http मॉड्यूल

// dotenv.config();
// connectDB();

// const app = express();

// // ⚙️ मिडिलवेयर्स
// app.use(cors());
// app.use(express.json({ limit: '50mb' })); 
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

// // ⚡ 1. CREATE HTTP SERVER AND INTEGRATE SOCKET.IO WITH CORS SETTINGS
// const server = http.createServer(app); 
// const io = require('socket.io')(server, {
//   cors: {
//     origin: "*", 
//     methods: ["GET", "POST"]
//   }
// });

// // इमेज सेव डायरेक्टरी
// const UPLOAD_DIR = process?.env?.UPLOAD_DIR || "D:/Project New/APP_LOGIN_PAGE/ALL-IMAGE-PROJECT";

// app.get("/", (req, res) => {
//   res.send("Backend API is running...");
// });

// // 📌 एपीआई राउट्स बाइंडिंग
// app.use("/api/auth", require("./routes/auth.routes"));
// app.use("/api/vendors", require("./routes/vendor.routes"));
// app.use("/api/user-profile", require("./routes/profile-user-vender.routes"));
// app.use("/api/permissions", require('./routes/permissions.routes'));
// app.use('/api/card', require('./routes/permissions.routes')); // कार्ड राउट्स
// app.use('/api/venues', require('./routes/venue.routes'));
// app.use('/api/email', require('./routes/email.routes'));
// app.use('/api/chat', require('./routes/chat.routes'));
// app.use('/api/notifications', require('./routes/notification.routes'));
// app.use('/api/dashboard', require('./routes/dashboard.routes'));

// // स्टैटिक इमेजेस सर्व करने का फोल्डर
// const IMAGES_FOLDER = "D:/Project New/APP_LOGIN_PAGE/ALL-IMAGE-PROJECT";
// app.use('/images', express.static(IMAGES_FOLDER));
// console.log("Images are being served from:", IMAGES_FOLDER);

// // 🌐 2. CORE SOCKET.IO IMPLEMENTATION (SINGLE SINGLETON BLOCK - NO DUPLICATES)
// const NotificationLog = require('./models/NotificationLog');
// const { parseNotificationText } = require('./utils/parser');

// io.on("connection", (socket) => {
//   // फ्रंटएंड (Angular) और एंड्रॉइड (Kotlin) दोनों से क्रेडेंशियल्स कैप्चर करना
//   const { userId, email, phone, activeTripId } = socket.handshake.auth;

//   if (userId) {
//     // 🔒 प्रत्येक यूजर को उसकी यूनिक आईडी के प्राइवेट रूम में अटैच करना
//     socket.join(userId);
//     console.log(`👤 User Room Activated: [${userId}] for ${email || 'Android App'}`);

//     // ✈️ ग्रुप ट्रिप हैंडलिंग: यदि यूजर किसी एक्टिव ट्रिप में है, तभी रूम जॉइन करवाए
//     if (activeTripId && activeTripId.trim() !== "") {
//       socket.join(activeTripId);
//       console.log(`✈️ User attached to Active Group Trip: [${activeTripId}]`);
//     } else {
//       console.log(`ℹ️ User [${email || userId}] वर्तमान में किसी भी ट्रip का हिस्सा नहीं है (पर्सनल मोड सक्रिय)`);
//     }
//   }

//   // 🔄 फ्रंटएंड (Angular) से डायनेमिकली ट्रिप रूम स्विच या नया रूम जॉइन करने का हैंडलर
//   socket.on("join_trip_room", ({ tripId }) => {
//     if (tripId && tripId.trim() !== "") {
//       socket.join(tripId);
//       console.log(`🔄 Socket context switched to Trip Room: ${tripId}`);
//     }
//   });

//   // 📥 एंड्रॉइड ऐप से आने वाला लाइव नोटिफिकेशन लिस्नर
//   // socket.on("live_notification_trigger", async (data) => {
//   //   try {
//   //     console.log(`📥 Live Pay Notification Captured for User [${userId}]:`, data.body);

//   //     // टेक्स्ट मैसेज में से अमाउंट और मर्चेंट का नाम फिल्टर करना (Regex Parser)
//   //     const parsedInfo = parseNotificationText(data.body);
//   //     const isDebit = data.body.toLowerCase().includes('sent') || data.body.toLowerCase().includes('debited');
//   //     // 💾 MongoDB में एंट्री को प्रॉपर स्टोर करना
//   //     const newLog = new NotificationLog({
//   //       userId: userId,
//   //       activeTripId: (activeTripId && activeTripId.trim() !== "") ? activeTripId : null,
//   //       appPackage: data.appPackage,
//   //       title: data.title,
//   //       rawBody: data.body,
//   //       amount: parsedInfo.amount,
//   //       merchant: parsedInfo.merchant,
//   //       type: isDebit ? 'debit' : 'credit',
//   //       isGroupExpense: !!(activeTripId && activeTripId.trim() !== ""),
//   //       timestamp: data.timestamp || Date.now()
//   //     });

//   //     const savedLog = await newLog.save();
//   //     console.log("💾 Notification Data successfully backed up in MongoDB!");

//   //     // पेलोड जो एंगुलर फ्रंटएंड को रीयल-टाइम रेंडर करने के लिए भेजा जाएगा
//   //     const uiPayload = {
//   //       logId: savedLog._id,
//   //       appPackage: savedLog.appPackage,
//   //       title: savedLog.title,
//   //       rawBody: savedLog.rawBody,
//   //       amount: savedLog.amount,
//   //       merchant: savedLog.merchant,
//   //       timestamp: savedLog.timestamp,
//   //       type: savedLog.type,
//   //       isGroupExpense: savedLog.isGroupExpense
//   //     };

//   //     // 📢 लाइव ब्रॉडकास्ट डिसीजन मेकर
//   //     if (activeTripId && activeTripId.trim() !== "") {
//   //       // पूरे ग्रुप के दोस्तों की एंगुलर स्क्रीन पर एक साथ सिंक करें
//   //       io.to(activeTripId).emit("ui_notification_update", uiPayload);
//   //       console.log(`📢 Group Room (${activeTripId}) updated live!`);
//   //     } else {
//   //       // सिर्फ उस सिंगल यूज़र की वेब स्क्रीन पर सेंड करें
//   //       io.to(userId).emit("ui_notification_update", uiPayload);
//   //       console.log(`🔒 Private User Screen (${userId}) updated live!`);
//   //     }

//   //   } catch (err) {
//   //     console.error("❌ Notification interception failed:", err.message);
//   //   }
//   // });



//   // 📥 एंड्रॉइड ऐप से आने वाला लाइव नोटिफिकेशन लिस्नर (server.js के अंदर इसे रिप्लेस करें)
// socket.on("live_notification_trigger", async (data) => {
//   try {
//     console.log(`📥 Live Pay Notification Captured for User [${userId}]:`, data.body);

//     const parsedInfo = parseNotificationText(data.body);
//     const isDebit = data.body.toLowerCase().includes('sent') || data.body.toLowerCase().includes('debited') || data.body.toLowerCase().includes('paid');

//     // 💾 MongoDB में लॉग सुरक्षित करें
//     const newLog = new NotificationLog({
//       userId: userId,
//       activeTripId: (activeTripId && activeTripId.trim() !== "") ? activeTripId : null,
//       appPackage: data.appPackage,
//       title: data.title,
//       rawBody: data.body,
//       amount: parsedInfo.amount,
//       merchant: parsedInfo.merchant,
//       type: isDebit ? 'debit' : 'credit',
//       isGroupExpense: !!(activeTripId && activeTripId.trim() !== ""),
//       timestamp: data.timestamp || Date.now()
//     });

//     const savedLog = await newLog.save();
//     console.log("💾 Notification Data successfully backed up in MongoDB!");

//     // 🔥 प्रो-आर्किटेक्चर मैजिक: बैकग्राउंड वॉलेट को तुरंत अपडेट करें!
//     const { updateWalletBalance } = require('./utils/balanceEngine');
//     await updateWalletBalance(userId);

//     const uiPayload = {
//       logId: savedLog._id,
//       appPackage: savedLog.appPackage,
//       title: savedLog.title,
//       rawBody: savedLog.rawBody,
//       amount: savedLog.amount,
//       merchant: savedLog.merchant,
//       timestamp: savedLog.timestamp,
//       type: savedLog.type,
//       isGroupExpense: savedLog.isGroupExpense
//     };

//     // 📢 लाइव ब्रॉडकास्ट डेसिशन
//     if (activeTripId && activeTripId.trim() !== "") {
//       io.to(activeTripId).emit("ui_notification_update", uiPayload);
//       console.log(`📢 Group Room (${activeTripId}) updated live!`);
//     } else {
//       io.to(userId).emit("ui_notification_update", uiPayload);
//       console.log(`🔒 Private User Screen (${userId}) updated live!`);
//     }

//   } catch (err) {
//     console.error("❌ Notification interception failed:", err.message);
//   }
// });
//   socket.on("disconnect", () => {
//     console.log(`🔌 Socket connection closed for user: ${userId}`);
//   });
// });

// // 🚀 SERVER LISTEN (IMPORTANT: सॉकेट के लिए 'server.listen' ही इस्तेमाल होना चाहिए)
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require('path');
const http = require('http'); // ⚡ सॉकेट सर्वर के लिए http मॉड्यूल

dotenv.config();
connectDB();

const app = express();

// ⚙️ मिडिलवेयर्स
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ⚡ 1. CREATE HTTP SERVER AND INTEGRATE SOCKET.IO WITH CORS SETTINGS
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// इमेज सेव डायरेक्टरी
const UPLOAD_DIR = process?.env?.UPLOAD_DIR || "D:/Project New/APP_LOGIN_PAGE/ALL-IMAGE-PROJECT";

app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

// 📌 एपीआई राउट्स बाइंडिंग
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/vendors", require("./routes/vendor.routes"));
app.use("/api/user-profile", require("./routes/profile-user-vender.routes"));
app.use("/api/permissions", require('./routes/permissions.routes'));
app.use('/api/card', require('./routes/permissions.routes'));
app.use('/api/venues', require('./routes/venue.routes'));
app.use('/api/email', require('./routes/email.routes'));
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/khata', require('./routes/khata.routes'));
app.use('/api/v1/wallet', require('./routes/wallet.routes'));
app.use('/api/v1/transactions', require('./routes/tx.routes'));
app.use('/api/v1/khata-chat', require('./routes/khataChat.routes'));



const IMAGES_FOLDER = "D:/Project New/APP_LOGIN_PAGE/ALL-IMAGE-PROJECT";
app.use('/images', express.static(IMAGES_FOLDER));
console.log("Images are being served from:", IMAGES_FOLDER);

// 🌐 2. CORE SOCKET.IO IMPLEMENTATION (MULTIPLE USER FRIENDLY)
const NotificationLog = require('./models/NotificationLog');
const { parseNotificationText } = require('./utils/parser');
const { updateWalletBalance } = require('./utils/balanceEngine'); // 🔥 टॉप पर इम्पोर्ट कर लिया

io.on("connection", (socket) => {
  console.log(`🔌 New Raw Socket Client Connected: ${socket.id}`);

  // 📥 फ्रंटएंड (Angular) या एंड्रॉइड जब पहली बार कनेक्ट हो तो रूम्स जॉइन कराएं
  const initialUserId = socket.handshake.auth?.userId;
  const initialTripId = socket.handshake.auth?.activeTripId;

  if (initialUserId) {
    socket.join(initialUserId);
    console.log(`👤 Room Activated on Connect: [${initialUserId}] (Socket ID: ${socket.id})`);

    if (initialTripId && initialTripId.trim() !== "") {
      socket.join(initialTripId);
      console.log(`✈️ Trip Room Attached on Connect: [${initialTripId}]`);
    }
  }

  // 🔄 फ्रंटएंड (Angular) से डायनेमिकली ट्रिप रूम स्विच करने का हैंडलर
  // जब कोई भी यूजर अपनी स्क्रीन पर ट्रिप बदलेगा, यह उसे सही ग्रुप रूम में डाल देगा
  socket.on("join_trip_room", ({ tripId, userId }) => {
    if (userId) {
      socket.join(userId);
    }
    if (tripId && tripId.trim() !== "") {
      socket.join(tripId);
      console.log(`🔄 [ROOM_SWITCH] User [${userId || 'Unknown'}] shifted to Trip Room: ${tripId}`);
    }
  });

  // 📥 एंड्रॉइड ऐप से आने वाला लाइव नोटिफिकेशन लिस्नर (पूर्णतः डायनेमिक)
  // socket.on("live_notification_trigger", async (data) => {
  //   try {
  //     // ⚡ क्रिटिकल चेंज: हैंडशेक के भरोसे न रहकर सीधे एंड्रॉइड के लाइव पेलोड से आईडी निकालें
  //     const targetUserId = data.userId || socket.handshake.auth?.userId;
  //     const targetTripId = data.activeTripId || socket.handshake.auth?.activeTripId;

  //     if (!targetUserId) {
  //       console.error("❌ Interception Aborted: Unidentified User! No userId found in payload or handshake.");
  //       return;
  //     }

  //     console.log(`📥 [LIVE_PAYMENT] Captured for Dynamic User [${targetUserId}] | App: ${data.appPackage}`);
  //     console.log(`📄 [RAW_TEXT]: ${data.body || data.rawBody}`);


  //     // -------------------------------------------------
  //     // const messageBody = data.body || data.rawBody || "";
  //     // const parsedInfo = parseNotificationText(messageBody);

  //     // // डेबिट या क्रेडिट पहचानने का लॉजिक
  //     // const isDebit = messageBody.toLowerCase().includes('sent') || 
  //     //                 messageBody.toLowerCase().includes('debited') || 
  //     //                 messageBody.toLowerCase().includes('paid');


  //     // const newLog = new NotificationLog({
  //     //   userId: targetUserId,
  //     //   activeTripId: (targetTripId && targetTripId.trim() !== "") ? targetTripId : null,
  //     //   appPackage: data.appPackage,
  //     //   title: data.title,
  //     //   rawBody: messageBody,
  //     //   amount: parsedInfo.amount,
  //     //   merchant: parsedInfo.merchant,
  //     //   senderName: parsedInfo.senderName,     // 🔥 पार्सर से आया नाम यहाँ स्टोर होगा
  //     //   receiverName: parsedInfo.receiverName, // 🔥 पार्सर से आया नाम यहाँ स्टोर होगा
  //     //   type: isDebit ? 'debit' : 'credit',
  //     //   isGroupExpense: !!(targetTripId && targetTripId.trim() !== ""),
  //     //   timestamp: data.timestamp || Date.now()
  //     // });



  //     // const savedLog = await newLog.save();
  //     // console.log(`💾 [MONGO_SUCCESS] Log saved with ID: ${savedLog._id} for User: ${targetUserId}`);

  //     // // 🔥 प्रो-आर्किटेक्चर मैजिक: बैकग्राउंड वॉलेट को उसी विशिष्ट यूजर आईडी के लिए अपडेट करें!
  //     // await updateWalletBalance(targetUserId);
  //     // console.log(`📊 [ENGINE_SYNC] Wallet updated dynamically for User: ${targetUserId}`);

  //     // // फ्रंटएंड के लिए परफेक्ट रिस्पॉन्स पेलोड
  //     // const uiPayload = {
  //     //   logId: savedLog._id,
  //     //   appPackage: savedLog.appPackage,
  //     //   title: savedLog.title,
  //     //   rawBody: savedLog.rawBody,
  //     //   amount: savedLog.amount,
  //     //   merchant: savedLog.merchant,
  //     //   timestamp: savedLog.timestamp,
  //     //   senderName: savedLog.senderName,     // 🔥 एंगुलर लिस्ट में दिखाने के लिए
  //     //   receiverName: savedLog.receiverName, // 🔥 एंगुलर लिस्ट में दिखाने के लिए
  //     //   type: savedLog.type,
  //     //   isGroupExpense: savedLog.isGroupExpense,
  //     //   userId: targetUserId // फ्रंटएंड को बताएं कि यह किसका ट्रांजैक्शन है
  //     // };


  //     // // 📢 लाइव ब्रॉडकास्ट डेसिशन (मल्टी-यूज़र सेफ)
  //     // if (targetTripId && targetTripId.trim() !== "") {
  //     //   // पूरे ग्रुप/ट्रिप के दोस्तों की स्क्रीन पर लाइव सिंक करें
  //     //   io.to(targetTripId).emit("ui_notification_update", uiPayload);
  //     //   console.log(`📢 [GROUP_BROADCAST] Broadcasted to Trip Room: [${targetTripId}]`);
  //     // } else {
  //     //   // सिर्फ उस विशिष्ट सिंगल यूज़र की वेब स्क्रीन पर सेंड करें
  //     //   io.to(targetUserId).emit("ui_notification_update", uiPayload);
  //     //   console.log(`🔒 [PRIVATE_EMIT] Sent exclusively to User Room: [${targetUserId}]`);
  //     // }


  //     // सॉकेट इवेंट के अंदर का हिस्सा...
  //     const messageBody = data.body || data.rawBody || "";
  //     const parsedInfo = parseNotificationText(messageBody);

  //     // डेबिट/क्रेडिट डिसीजन
  //     const isDebit = messageBody.toLowerCase().includes('sent') ||
  //       messageBody.toLowerCase().includes('debited') ||
  //       messageBody.toLowerCase().includes('paid');

  //     // मोंगूज़ में लॉग सेव करें
  //     const newLog = new NotificationLog({
  //       userId: targetUserId,
  //       activeTripId: (targetTripId && targetTripId.trim() !== "") ? targetTripId : null,
  //       appPackage: data.appPackage,
  //       title: data.title || parsedInfo.bankName, // फॉलबैक बैंक नेम
  //       rawBody: messageBody,
  //       amount: parsedInfo.amount,
  //       merchant: parsedInfo.merchant,
  //       senderName: parsedInfo.senderName,
  //       receiverName: parsedInfo.receiverName,
  //       type: isDebit ? 'debit' : 'credit',
  //       isGroupExpense: !!(targetTripId && targetTripId.trim() !== ""),
  //       timestamp: data.timestamp || Date.now()
  //     });

  //     const savedLog = await newLog.save();

  //     // 🔥 पासिंग मैजिक: वॉलेट बैलेंस अपडेट करते समय पार्स इन्फो को भी साथ भेजें
  //     // इससे अगर 'Total Bal' मैसेज में आया है, तो वह सीधे वॉलेट में सेट हो जाएगा!
  //     const updatedWalletPayload = await updateWalletBalance(targetUserId, {
  //       ...parsedInfo,
  //       type: isDebit ? 'debit' : 'credit'
  //     });

  //     // फ्रंटएंड पेलोड तैयार करें
  //     const uiPayload = {
  //       logId: savedLog._id,
  //       appPackage: savedLog.appPackage,
  //       title: savedLog.title,
  //       rawBody: savedLog.rawBody,
  //       amount: savedLog.amount,
  //       merchant: savedLog.merchant,
  //       timestamp: savedLog.timestamp,
  //       senderName: savedLog.senderName,
  //       receiverName: savedLog.receiverName,
  //       type: savedLog.type,
  //       walletSummary: {
  //         totalBalance: updatedWalletPayload.totalBalance,
  //         banksBreakdown: updatedWalletPayload.banks
  //       }
  //     };

  //     // ब्रॉडकास्ट लॉजिक
  //     if (targetTripId && targetTripId.trim() !== "") {
  //       io.to(targetTripId).emit("ui_notification_update", uiPayload);
  //     } else {
  //       io.to(targetUserId).emit("ui_notification_update", uiPayload);
  //     }

  //     // ---------------------------

  //   } catch (err) {
  //     console.error("❌ [CRITICAL_INTERCEPT_ERROR]:", err.message);
  //   }
  // });


  socket.on("live_notification_trigger", async (data) => {
    try {
      const targetUserId = data.userId || socket.handshake.auth?.userId;
      const targetTripId = data.activeTripId || socket.handshake.auth?.activeTripId;

      if (!targetUserId) {
        console.error("❌ Interception Aborted: No userId found.");
        return;
      }

      const messageBody = data.body || data.rawBody || "";

      // 🧠 पार्सर को कॉल करें (अमाउंट, मर्चेंट, बैंक नेम, लाइव बैलेंस प्राप्त करें)
      const parsedInfo = parseNotificationText(messageBody);

      const isDebit = messageBody.toLowerCase().includes('sent') ||
        messageBody.toLowerCase().includes('debited') ||
        messageBody.toLowerCase().includes('paid');

      // 💾 1. मोंगोडीबी में लॉग को सेव करें
      const newLog = new NotificationLog({
        userId: targetUserId,
        activeTripId: (targetTripId && targetTripId.trim() !== "") ? targetTripId : null,
        appPackage: data.appPackage,
        title: data.title || parsedInfo.bankName,
        rawBody: messageBody,
        amount: parsedInfo.amount,
        merchant: parsedInfo.merchant,
        senderName: parsedInfo.senderName,
        receiverName: parsedInfo.receiverName,
        type: isDebit ? 'debit' : 'credit',
        isGroupExpense: !!(targetTripId && targetTripId.trim() !== ""),
        timestamp: data.timestamp || Date.now()
      });

      const savedLog = await newLog.save();
      console.log(`💾 [MONGO_SUCCESS] Log saved. Bank identified: ${parsedInfo.bankName}`);

      // 📊 2. लाइव सेपरेट वॉलेट को सिंक करें (पार्स किया हुआ डेटा पास कर रहे हैं)
      const updatedWallet = await updateWalletBalance(targetUserId, {
        ...parsedInfo,
        type: isDebit ? 'debit' : 'credit'
      });

      // 📢 3. फ्रंटएंड (Angular) के लिए सॉलिड लाइव पेलोड
      const uiPayload = {
        logId: savedLog._id,
        appPackage: savedLog.appPackage,
        title: savedLog.title,
        rawBody: savedLog.rawBody,
        amount: savedLog.amount,
        merchant: savedLog.merchant,
        senderName: savedLog.senderName,
        receiverName: savedLog.receiverName,
        type: savedLog.type,
        isGroupExpense: savedLog.isGroupExpense,
        timestamp: savedLog.timestamp,
        walletSummary: {
          totalBalance: updatedWallet ? updatedWallet.totalBalance : 0,
          youWillGet: updatedWallet ? updatedWallet.youWillGet : 0,
          youWillGive: updatedWallet ? updatedWallet.youWillGive : 0,
          banksBreakdown: updatedWallet ? updatedWallet.banks : []
        }
      };

      // ब्रॉडकास्ट डेसिशन
      if (targetTripId && targetTripId.trim() !== "") {
        io.to(targetTripId).emit("ui_notification_update", uiPayload);
      } else {
        io.to(targetUserId).emit("ui_notification_update", uiPayload);
      }

    } catch (err) {
      console.error("❌ [CRITICAL_INTERCEPT_ERROR]:", err.message);
    }
  });
  socket.on("disconnect", () => {
    console.log(`🔌 Socket Connection Closed for Client: ${socket.id}`);
  });
});

// 🚀 SERVER LISTEN
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Multi-User Dynamic Server running on port ${PORT}`));