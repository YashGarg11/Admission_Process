// routes/applicationRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { submitPersonalDetails, submitAcademicDetails } = require("../controllers/admissionController");
const { generateIDCard } = require("../controllers/paymentGateway");
const upload = require("../middleware/uploadMiddleware");
const multer = require('multer');

router.post(
  "/personal-details",
  protect,
  upload.single("counselingLetter"),
  submitPersonalDetails
);

router.post(
  "/academic-details",
  protect,
  upload.fields([
    { name: 'documents', maxCount: 10 }
  ]),
  submitAcademicDetails
);

// Generate ID Card for approved applications
router.get(
  "/generate-idcard/:id",
  protect,
  generateIDCard
);

module.exports = router;
