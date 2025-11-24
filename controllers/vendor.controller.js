// controllers/vendor.controller.js
const mongoose = require('mongoose');
const VendorUser = require('../models/vendor.model.js');

// Create Vendor
exports.createVendor = async (req, res) => {
  try {
    const vendor = new VendorSchema(req.body);
    await vendor.save();
    res.status(201).json({ message: "Vendor created successfully", vendor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Vendors
exports.getAllVendors = async (req, res) => {
  try {
	console.log("Fetching all vendors");
    const vendors = await VendorUser.find();
    res.status(200).json({data:vendors , message: "Vendors fetched successfully", status: 1 });
  } catch (error) {
    res.status(500).json({ error: error.message, status: 0 });
  }
};

// Get Vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await VendorSchema.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Vendor
exports.updateVendor = async (req, res) => {
  try {
    const vendor = await VendorSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json({ message: "Vendor updated", vendor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Vendor
exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await VendorSchema.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createVendorTest = async (req, res) => {
  try {
    const vendorData = {
      userId: "671b9e6cf0d4b2a88e1f19ff",
      email: "studio@momentsnap.in",
      phone: "+91-9876543210",
      businessName: "Moment Snap Studio",
      displayName: "Moment Snap",
      slug: "moment-snap-studio",
      tagline: "Capturing your best memories!",
      about: "We specialize in wedding, birthday, and corporate event photography.",
      profileImage: {
        url: "https://res.cloudinary.com/demo/image/upload/v1/profile/moment.jpg",
        publicId: "profile/moment"
      },
      coverImage: {
        url: "https://res.cloudinary.com/demo/image/upload/v1/cover/moment.jpg",
        publicId: "cover/moment"
      },
      address: {
        street: "123 MG Road",
        city: "Pune",
        state: "Maharashtra",
        postalCode: "411001",
        country: "India"
      },
      location: {
        type: "Point",
        coordinates: [73.8567, 18.5204]
      },
      services: [
        {
          title: "Wedding Photography",
          slug: "wedding-photography",
          category: "Photography",
          subcategory: "Wedding",
          description: "Full-day wedding coverage with candid and traditional shots.",
          price: { base: 25000, currency: "INR", unit: "event" },
          gallery: [
            {
              url: "https://res.cloudinary.com/demo/image/upload/v1/gallery/1.jpg",
              publicId: "gallery/1",
              caption: "Outdoor ceremony"
            }
          ],
          extras: [
            { name: "Drone Coverage", price: 5000 },
            { name: "Album Printing", price: 3000 }
          ],
          durationMinutes: 480,
          meta: { tags: ["wedding", "photography"], featured: true }
        }
      ],
      availability: [
        {
          type: "range",
          from: new Date("2025-11-01"),
          to: new Date("2025-11-10"),
          blocked: false,
          note: "Available for weddings"
        }
      ],
      kyc: {
        completed: true,
        documents: [
          {
            type: "businessLicense",
            fileUrl: "https://res.cloudinary.com/demo/docs/license.pdf",
            fileId: "docs/license.pdf",
            status: "approved"
          }
        ],
        verifiedAt: new Date()
      },
      rating: { avg: 4.8, count: 120 },
      payoutAccount: {
        provider: "razorpay",
        accountId: "acct_razor_abc123",
        payoutMethod: "bank_transfer"
      },
      earnings: {
        total: 250000,
        pending: 15000,
        withdrawn: 235000,
        currency: "INR"
      },
      settings: {
        autoAcceptRequests: true,
        notificationPrefs: {
          email: true,
          sms: true,
          push: false
        }
      },
      tags: ["wedding", "photographer", "pune"],
      seoMeta: {
        title: "Best Wedding Photographer in Pune",
        description: "Book Moment Snap Studio for premium wedding photography."
      },
      stats: {
        totalBookings: 210,
        canceledBookings: 10,
        lastBookingAt: new Date("2025-10-22T18:00:00Z")
      },
      status: "active"
    };
    if (!mongoose.Types.ObjectId.isValid(vendorData.userId)) {
      return res.status(400).json({ error: "Invalid vendor ID" });
    }
    
    console.log("Creating vendor with data:", vendorData);
	const vendor = new VendorUser(vendorData);
    await vendor.save();

    res.status(201).json({
      message: "✅ Vendor created successfully (hardcoded test data)",
      vendor
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
