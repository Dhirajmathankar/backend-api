const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true, // one profile per user
    required: true
  },

  Name: String,
  Email: String,
  PhoneNumber: String,

  shopName: String,
  tagline: String,
  description: String,
  shopCategory: String,
  websiteUrl: String,
  contactEmail: String,
  contactPhone: String,

  address: {
    street: String,
    city: String,
    zipCode: String,
    country: String
  },

  profileImageUrl: String,

  galleryImages: [String],

  isDeleted: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("users-Profile", ProfileSchema);
