const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  submitPersonalDetails,
  submitAcademicDetails,
  submitCourse,
  getFormProgress
} = require("../controllers/admissionController");
const { upload } = require("../middleware/uploadMiddleware"); // ✅ destructure upload

// Route for personal details with counseling letter upload
router.post(
  "/personal-details",
  protect,
  upload.single("counselingLetter"),
  submitPersonalDetails
);

// Route for academic document uploads
router.post(
  "/academic-details",
  protect,
  upload.fields([
    { name: 'marksheet_10', maxCount: 1 },
    { name: 'marksheet_12', maxCount: 1 },
    { name: 'tc', maxCount: 1 },
    { name: 'character_cert', maxCount: 1 },
    { name: 'migration_cert', maxCount: 1 },
    { name: 'medical_cert', maxCount: 1 },
    { name: 'income_cert', maxCount: 1 },
    { name: 'aadhar_card', maxCount: 1 },
    { name: 'passport_photo', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
  ]),
  submitAcademicDetails
);

// Submit selected course
router.post('/course', protect, submitCourse);

// Get form progress
router.post('/form/progress', protect, getFormProgress);

module.exports = router;
