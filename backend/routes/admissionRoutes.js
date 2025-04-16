const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  submitApplication,
  getMyApplication,
} = require("../controllers/admissionController");

// Route to submit a new application
router.post("/", protect, submitApplication);

// Route to get the current user's application
router.get("/my", protect, getMyApplication);

module.exports = router;
