// vendor.model.js
const mongoose = require('mongoose');
// import mongoose from 'mongoose';
const { Schema } = mongoose;
new mongoose.Types.ObjectId()

// --- Service subdocument schema (embedded) ---
const ServiceSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, index: true }, // for SEO url
  category: { type: String, required: true, index: true },
  subcategory: { type: String },
  description: { type: String },
  price: {
    base: { type: Number, required: true, min: 0 }, // base price
    currency: { type: String, default: 'INR' },
    unit: { type: String, enum: ['hour', 'day', 'event', 'package'], default: 'event' }
  },
  gallery: [{
    url: String,
    publicId: String, // cloudinary/S3 identifier
    caption: String
  }],
  extras: [{
    name: String,
    price: Number,
    required: { type: Boolean, default: false }
  }],
  durationMinutes: { type: Number }, // estimated duration if applicable
  locationScope: { type: String, enum: ['on-site', 'remote', 'both'], default: 'on-site' },
  meta: {
    tags: [String],
    featured: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { _id: true });

// --- Availability block (date range or slot) ---
const AvailabilitySchema = new Schema({
  type: { type: String, enum: ['range', 'slot', 'recurring'], default: 'range' },
  // range: { from, to }
  from: { type: Date },
  to: { type: Date },
  // slot: day-of-week + start/end time in minutes from midnight
  dayOfWeek: { type: Number, min: 0, max: 6 }, // 0=Sun
  startMinute: { type: Number, min: 0, max: 1440 },
  endMinute: { type: Number, min: 0, max: 1440 },
  // recurring rule: simple RRULE-like string or structured object
  rrule: { type: String },
  note: { type: String },
  blocked: { type: Boolean, default: false }, // true if blocked/unavailable
  createdAt: { type: Date, default: Date.now }
});

// --- KYC / Documents schema ---
const DocumentSchema = new Schema({
  type: { type: String }, // e.g., 'businessLicense', 'idProof'
  fileUrl: { type: String },
  fileId: { type: String }, // storage id
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  uploadedAt: { type: Date, default: Date.now },
  reviewedAt: Date,
  notes: String
});

// --- Main Vendor schema ---
const VendorSchema = new Schema({
  // Auth / linkage
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // links to users collection
  email: { type: String, required: true, lowercase: true, index: true },
  phone: { type: String, index: true },

  // Basic profile
  businessName: { type: String, required: true, index: true },
  displayName: { type: String }, // fallback
  slug: { type: String, index: true }, // vendor public url
  tagline: { type: String },
  about: { type: String },
  profileImage: {
    url: String,
    publicId: String
  },
  coverImage: {
    url: String,
    publicId: String
  },
  // Address & geolocation for search
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  location: {
    // geoJSON point for geospatial search
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0,0] } // [lng, lat]
  },
  serviceAreas: [{ // e.g., list of city/state or radius objects
    name: String,
    radiusKm: Number,
    center: { type: [Number] } // optional [lng, lat]
  }],

  // Vendor offerings & availability
  services: [ServiceSchema],
  availability: [AvailabilitySchema], // available/unavailable blocks

  // Verification, status & KYC
  status: { type: String, enum: ['draft','pending','active','suspended','banned'], default: 'draft', index: true },
  kyc: {
    completed: { type: Boolean, default: false },
    documents: [DocumentSchema],
    verifiedAt: Date,
    verifierId: { type: Schema.Types.ObjectId, ref: 'Admin' }
  },

  // Ratings & reviews (denormalized aggregates)
  rating: {
    avg: { type: Number, default: 0, min: 0, max: 5, index: true },
    count: { type: Number, default: 0 }
  },

  // Operational / financial
  payoutAccount: { // metadata only
    provider: { type: String, enum: ['razorpay','stripe','bank'] },
    accountId: String, // e.g., stripeAcctId or bank masked id
    payoutMethod: { type: String }
  },
  earnings: {
    total: { type: Number, default: 0 },
    pending: { type: Number, default: 0 },
    withdrawn: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' }
  },

  // Settings & preferences
  settings: {
    autoAcceptRequests: { type: Boolean, default: false },
    notificationPrefs: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },

  // Platform metadata
  tags: [String],
  seoMeta: {
    title: String,
    description: String
  },

  // Analytics (denormalized shallow stats)
  stats: {
    totalBookings: { type: Number, default: 0, index: true },
    canceledBookings: { type: Number, default: 0 },
    lastBookingAt: Date,
    monthlyBookings: { type: Map, of: Number } // e.g. { '2025-10': 12 }
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// --- Geo index for location-based search ---
VendorSchema.index({ location: '2dsphere' });

// Compound index to speed up searches by category + city + status
VendorSchema.index({ 'services.category': 1, 'address.city': 1, status: 1 });

// Text index for quick search on businessName, about and tags
VendorSchema.index({ businessName: 'text', about: 'text', 'services.title': 'text', tags: 'text' });

// --- Virtuals ---
VendorSchema.virtual('avgRating').get(function() {
  return this.rating ? this.rating.avg : 0;
});

// --- Hooks: update timestamps ---
VendorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Optionally update denormalized counts when a new review is saved via Review model hooks
// e.g., ReviewSchema.post('save', async function() { await Vendor.findByIdAndUpdate(...)})

// module.exports = mongoose.model('vendor_user', VendorSchema);
module.exports = mongoose.model('vendor_user', VendorSchema);


