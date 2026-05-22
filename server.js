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


const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require('path');
const http = require('http'); // 🔥 सॉकेट सर्वर के लिए http मॉड्यूल जोड़ा

dotenv.config();
connectDB();

const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ⚡ 1. CREATE HTTP SERVER FOR SOCKET.IO
const server = http.createServer(app); 
const io = require('socket.io')(server, {
  cors: {
    origin: "*", // प्रोडक्शन में इसे अपने एंगुलर ऐप के यूआरएल से रिप्लेस कर सकते हैं
    methods: ["GET", "POST"]
  }
});

// 2. IMAGE SAVE DIRECTORY
const UPLOAD_DIR = process?.env?.UPLOAD_DIR || "D:/Project New/APP_LOGIN_PAGE/ALL-IMAGE-PROJECT";

app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

app.use("/api/auth", require("./routes/auth.routes"));

const vendorRoutes = require("./routes/vendor.routes");
app.use("/api/vendors", vendorRoutes);
const userProfileRoute = require("./routes/profile-user-vender.routes");
app.use("/api/user-profile", userProfileRoute);
const permissionRoutes = require('./routes/permissions.routes');
app.use('/api/permissions', permissionRoutes);

const card = require('./routes/card.routes');
app.use('/api/card', permissionRoutes);

const venues = require('./routes/venue.routes');
app.use('/api/venues/', venues);

const emailRoutes = require('./routes/email.routes');

app.use('/api/email', emailRoutes);

const emailService = require('./services/email.service');

app.use('/api/chat', require('./routes/chat.routes'));


// (async () => {
//   try {
//     await emailService.sendMail({
//       to: 'dhirajmathankar@gmail.com',
//       subject: 'Direct Test Email',
//       message: 'Email service working without API endpoint 🚀'
//     });
//     console.log('✅ Direct email test successful');
//   } catch (err) {
//     console.error('❌ Direct email test failed:', err.message);
//   }
// })();

// THIS IS FOR THE USER PAYMENT NOTIFICATION ROUTE THERE IM HANDLING THIS FUNCTIONALITY
app.use('/api/notifications', require('./routes/notification.routes'));

// const path = require('path');

// Sabse safe tarika: Direct absolute path use karein
const IMAGES_FOLDER = "D:/Project New/APP_LOGIN_PAGE/ALL-IMAGE-PROJECT";

// Express ko batayein ki is folder ki files ko /images URL par serve kare
app.use('/images', express.static(IMAGES_FOLDER));

// Check karne ke liye ki server sahi folder dekh raha hai
console.log("Images are being served from:", IMAGES_FOLDER);


// 🌐 3. SMART MULTI-USER SOCKET.IO LOGIC INTEGRATION
const NotificationLog = require('./models/NotificationLog');
const { parseNotificationText } = require('./utils/parser');

io.on("connection", (socket) => {
  // एंड्रॉइड ऐप और वेब ऐप से क्रेडेंशियल्स कैप्चर करना
  const { userId, activeTripId } = socket.handshake.auth;

  if (userId) {
    // यूज़र को उसके यूनिक प्राइवेट रूम में जॉइन करवाएं
    socket.join(`user_${userId}`);
    console.log(`👤 User Connected: ${userId} attached to private room [user_${userId}]`);

    // अगर कोई एक्टिव ट्रिप असाइंड है, तो ट्रिप वाले रूम में भी डालो
    if (activeTripId) {
      socket.join(`trip_${activeTripId}`);
      console.log(`✈️ User ${userId} joined Group Trip Room [trip_${activeTripId}]`);
    }
  }

  // फ्रंटएंड (Angular) से डायनेमिकली ट्रिप रूम स्विच करने का हैंडलर
  socket.on("join_trip_room", ({ tripId }) => {
    if (tripId) {
      socket.join(`trip_${tripId}`);
      console.log(`🔄 Socket context switched to Trip Room: trip_${tripId}`);
    }
  });

  // 📥 एंड्रॉइड ऐप से आने वाला लाइव नोटिफिकेशन ट्रिगर इवेंट
  socket.on("live_notification_trigger", async (data) => {
    try {
      console.log(`📥 Live Pay Notification Captured for User [${userId}]:`, data.body);

      // टेक्स्ट मैसेज में से अमाउंट और मर्चेंट का नाम फिल्टर करना (Regex Parser)
      const parsedInfo = parseNotificationText(data.body);

      // 💾 MongoDB में एंट्री को प्रॉपर स्टोर करना
      const newLog = new NotificationLog({
        userId: userId,
        activeTripId: activeTripId || null,
        appPackage: data.appPackage,
        title: data.title,
        rawBody: data.body,
        amount: parsedInfo.amount,
        merchant: parsedInfo.merchant,
        isGroupExpense: !!activeTripId,
        timestamp: data.timestamp || Date.now()
      });

      const savedLog = await newLog.save();
      console.log("💾 Notification Data successfully backed up in MongoDB!");

      // पेलोड जो एंगुलर फ्रंटएंड को भेजा जाएगा
      const uiPayload = {
        logId: savedLog._id,
        appPackage: savedLog.appPackage,
        title: savedLog.title,
        rawBody: savedLog.rawBody,
        amount: savedLog.amount,
        merchant: savedLog.merchant,
        timestamp: savedLog.timestamp,
        isGroupExpense: savedLog.isGroupExpense
      };

      // 📢 लाइव ब्रॉडकास्ट (सुरक्षित रूप से केवल संबंधित कमरे में)
      if (activeTripId) {
        // पूरे ग्रुप के दोस्तों को एक साथ सिंक करें
        io.to(`trip_${activeTripId}`).emit("ui_notification_update", uiPayload);
        console.log(`📢 Group Room (trip_${activeTripId}) updated live!`);
      } else {
        // सिर्फ उस सिंगल यूज़र की वेब स्क्रीन पर सेंड करें
        io.to(`user_${userId}`).emit("ui_notification_update", uiPayload);
        console.log(`🔒 Private User Screen (user_${userId}) updated live!`);
      }

    } catch (err) {
      console.error("❌ Notification interception failed:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Socket connection closed for user: ${userId}`);
  });
});


const PORT = process.env.PORT || 5000;
// 🚨 नोट: सॉकेट कनेक्टिविटी के लिए अब ऐप को 'server.listen' के ज़रिये रन करना ज़रूरी है, 'app.listen' से नहीं।
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));