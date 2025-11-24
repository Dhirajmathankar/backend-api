// routes/vendor.routes.js
const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendor.controller");

// CRUD routes
router.post("/", vendorController.createVendor); 
router.get("/", vendorController.getAllVendors);
router.get("/:id", vendorController.getVendorById);
router.put("/:id", vendorController.updateVendor);
router.delete("/:id", vendorController.deleteVendor);


// router.get("/Test", vendorController.createVendorTest);

module.exports = router;
