const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let baseString = `mongodb+srv://${process.env.User}:${process.env.Password}@memoria-cluster.mq1gblx.mongodb.net/memoria-Dev` || "mongodb://localhost:27017/";
    await mongoose.connect(baseString);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
