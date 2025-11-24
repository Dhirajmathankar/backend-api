const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

app.use("/api/auth", require("./routes/auth.routes"));

const vendorRoutes = require("./routes/vendor.routes");
app.use("/api/vendors", vendorRoutes);
const userProfileRoute = require("./routes/profile-user-vender.routes");
app.use("/api/user-profile", userProfileRoute);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
