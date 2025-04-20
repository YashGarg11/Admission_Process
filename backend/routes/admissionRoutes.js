// routes/applicationRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { submitPersonalDetails, submitAcademicDetails } = require("../controllers/admissionController");

const { generateIDCard } = require("../controllers/paymentGateway");
const upload = require("../middleware/uploadMideeleware");  // Multer for file uploads

// Step 1: Submit Personal Details and Counseling Letter (PDF)
router.post("/personal-details", protect, upload.single("counselingLetter"), submitPersonalDetails);

router.post("/academic-details", protect, upload.array("documents"), submitAcademicDetails);



router.get("/generate-idcard/:id", protect, generateIDCard);


module.exports = router;
