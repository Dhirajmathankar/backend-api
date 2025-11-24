const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {protect} = require("../middleware/authMiddleware"); // ✅ import this

// Public routes
router.post("/register", authController.UserRegister);
router.post("/login", authController.UserLogin);
router.post("/refresh", authController.RefreshToken);

// Private routes
router.get("/profile", protect, authController.UserProfile);
router.post("/logout", protect, authController.UserLogout);

module.exports = router;
