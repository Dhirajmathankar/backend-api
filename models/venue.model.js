// const mongoose = require('mongoose');

// const venueSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     pricePerDay: { type: Number },
//     guestCapacity: { type: Number },
//     shortDescription: { type: String },
//     fullDescription: { type: String },
//     policies: {
//         cancellation: String,
//         paymentTerms: String
//     },
//     amenities: {
//         features: [String],
//         services: [String],
//         isAC: { type: Boolean, default: false },
//         isParking: { type: Boolean, default: false },
//         isCatering: { type: Boolean, default: false },
//         isSoundSystem: { type: Boolean, default: false }
//     },
//     location: { type: String },
//     images: [String], // Array of URLs
//     suitabilityTags: [String]
// }, { timestamps: true });

// module.exports = mongoose.model('Venue', venueSchema);



const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema(
  {
    // 🔑 Ownership
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // 🏷 Basic Info
    venueName: {
      type: String,
      required: true,
      trim: true
    },

    pricePerDay: {
      type: Number,
      default: null
    },

    guestCapacity: {
      type: Number,
      default: null
    },

    shortDescription: {
      type: String,
      trim: true
    },

    // 📝 Descriptions
    fullDescription: {
      type: String, // legacy support
      trim: true
    },

    about: {
      type: String, // new tab content
      trim: true
    },

    // 📍 Location
    location: {
      type: String,
      trim: true
    },

    // ⭐ Amenities (as per frontend)
    amenities: {
      features: {
        type: String, // comma separated string
        default: ''
      },
      services: {
        type: String, // comma separated string
        default: ''
      },
      isAC: {
        type: Boolean,
        default: true
      },
      isParking: {
        type: Boolean,
        default: true
      },
      isCatering: {
        type: Boolean,
        default: false
      },
      isSoundSystem: {
        type: Boolean,
        default: true
      }
    },

    // 📜 Policies
    policies: {
      cancellation: {
        type: String,
        default: ''
      },
      paymentTerms: {
        type: String,
        default: ''
      }
    },

    // 🖼 Images
    images: {
      type: [String], // array of URLs
      default: []
    },

    // 🚗 Extra Flags (as per frontend naming)
    ParkingAvailable: {
      type: String,
      default: ''
    },

    InhouseCatering: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Venue', venueSchema);
