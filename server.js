const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require('path');

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


// const path = require('path');

// Sabse safe tarika: Direct absolute path use karein
const IMAGES_FOLDER = "D:/Project New/APP_LOGIN_PAGE/ALL-IMAGE-PROJECT";

// Express ko batayein ki is folder ki files ko /images URL par serve kare
app.use('/images', express.static(IMAGES_FOLDER));

// Check karne ke liye ki server sahi folder dekh raha hai
console.log("Images are being served from:", IMAGES_FOLDER);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
