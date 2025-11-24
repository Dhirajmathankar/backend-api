const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const profileController = require("../controllers/profile-user-vender.controller");

router.post("/getInfo", protect, profileController.getProfile);
router.post("/save", protect,  profileController.saveProfile);
router.delete("/delete", profileController.deleteProfile);

module.exports = router;
