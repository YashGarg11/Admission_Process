const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const {
  getAllApplications,
  updateApplicationStatus,
} = require("../controllers/adminController");

// Admin route to get all applications
router.get("/applications", protect, isAdmin, getAllApplications);

// Admin route to update the status of an application
router.put("/applications/:id", protect, isAdmin, updateApplicationStatus);

module.exports = router;
