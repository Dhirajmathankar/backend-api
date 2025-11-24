const Profile = require("../models/profile-user-vender");

// Create or Update Profile
exports.saveProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = req.body;

    let profile = await Profile.findOne({ userId });

    if (!profile) {
      profile = await Profile.create({ userId, ...data });
      return res.status(201).json({
        success: true,
        message: "Profile created successfully",
        profile
      });
    }

    // Update existing profile
    Object.assign(profile, data);
    await profile.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
	console.log("Fetching user profile", req.body.userId  );
    const userId = req.body.userId || req.user.id;

    const profile = await Profile.findOne({ userId, isDeleted: false });

    if (!profile) {
      return res.json({ success: true, profile: null });
    }

    res.json({ success: true, profile });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Soft Delete
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    await Profile.findOneAndUpdate(
      { userId },
      { isDeleted: true }
    );

    res.json({
      success: true,
      message: "Profile soft deleted"
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
