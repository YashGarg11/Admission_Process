const Application = require("../models/Application");
const { uploadToS3 } = require('../middleware/uploadMiddleware');

exports.submitPersonalDetails = async (req, res) => {
  try {
    const { name, email, mobile, address } = req.body;

    const trimmedName = name?.trim() || '';
    const trimmedEmail = email?.trim() || '';
    const trimmedMobile = mobile?.trim() || '';
    const trimmedAddress = address?.trim() || '';

    if (!trimmedName || !trimmedEmail || !trimmedMobile || !trimmedAddress) {
      return res.status(400).json({
        message: "Missing required fields",
        details: "Name, email, mobile, and address are required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Missing counseling letter",
        details: "Counseling letter PDF is required"
      });
    }

    // ✅ Upload file to S3
    const s3Url = await uploadToS3(req.file, 'counseling');

    // ✅ Check if user already has an application
    const existingApplication = await Application.findOne({
      user: req.user._id,
      status: "pending"
    });

    let application;

    if (existingApplication) {
      // ✅ UPDATE existing application instead of rejecting
      application = await Application.findOneAndUpdate(
        { user: req.user._id, status: "pending" },
        {
          name: trimmedName,
          email: trimmedEmail,
          mobile: trimmedMobile,
          address: trimmedAddress,
          counselingLetter: s3Url,
          'progress.personal': true,
          // Keep course progress if it was already set
          'progress.course': existingApplication.progress?.course || false
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Personal details updated successfully!",
        applicationId: application._id,
        isUpdate: true
      });
    } else {
      // ✅ CREATE new application
      application = new Application({
        user: req.user._id,
        name: trimmedName,
        email: trimmedEmail,
        mobile: trimmedMobile,
        address: trimmedAddress,
        counselingLetter: s3Url,
        progress: {
          course: false,
          personal: true,
          academic: false,
        }
      });

      await application.save();

      return res.status(201).json({
        success: true,
        message: "Personal details submitted successfully!",
        applicationId: application._id,
        isUpdate: false
      });
    }

  } catch (err) {
    console.error("Error in submitPersonalDetails:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.submitAcademicDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const files = req.files;

    const academicDocuments = [];
    const documentUrls = {}; // ✅ for frontend

    for (const key in files) {
      const file = files[key][0];

      // Upload to S3
      const s3Url = await uploadToS3(file, 'academic');

      academicDocuments.push({
        path: s3Url,
        name: file.originalname,
        type: key,
      });

      // Add to frontend-expected object
      documentUrls[key] = s3Url;
    }

    const updated = await Application.findOneAndUpdate(
      { user: userId },
      {
        $push: { academicDocuments: { $each: academicDocuments } },
        $set: { "progress.academic": true }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ✅ Send required fields for frontend
    res.status(200).json({
      userId,
      documents: documentUrls
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

exports.getFormProgress = async (req, res) => {
  try {
    const application = await Application.findOne({ user: req.user._id });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Convert progress object to numeric stage
    const progressObject = application.progress || {};
    let progressStep = 1;

    if (progressObject.course && !progressObject.personal) progressStep = 2;
    else if (progressObject.course && progressObject.personal && !progressObject.academic) progressStep = 3;
    else if (progressObject.course && progressObject.personal && progressObject.academic) progressStep = 4;

    res.status(200).json({ progress: progressStep });
  } catch (err) {
    console.error("Get Progress Error:", err);
    res.status(500).json({ message: "Unable to fetch progress", error: err.message });
  }
};

exports.submitCourse = async (req, res) => {
  try {
    const { course } = req.body;

    if (!course) {
      return res.status(400).json({ message: 'Course is required' });
    }

    // ✅ Find existing application first
    let application = await Application.findOne({ user: req.user._id });

    if (application) {
      // ✅ Update existing application
      application = await Application.findOneAndUpdate(
        { user: req.user._id },
        {
          course,
          'progress.course': true
        },
        { new: true }
      );
    } else {
      // ✅ Create new application if none exists
      application = new Application({
        user: req.user._id,
        course,
        progress: {
          course: true,
          personal: false,
          academic: false,
        }
      });
      await application.save();
    }

    res.status(200).json({
      message: 'Course saved successfully',
      application: application,
    });
  } catch (error) {
    console.error('Error saving course:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};