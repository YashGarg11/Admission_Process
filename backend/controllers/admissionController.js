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

    // ✅ Corrected usage
    const s3Url = await uploadToS3(req.file, 'counseling');

    const existingApplication = await Application.findOne({
      user: req.user._id,
      status: "pending"
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You already have a pending application"
      });
    }

    const newApplication = new Application({
      user: req.user._id,
      name: trimmedName,
      email: trimmedEmail,
      mobile: trimmedMobile,
      address: trimmedAddress,
      counselingLetter: s3Url,
      progress: {
        course: true,
        personal: true,
        academic: false,
      }
    });

    await newApplication.save();

    res.status(201).json({
      success: true,
      message: "Personal details submitted successfully!",
      applicationId: newApplication._id
    });
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

    for (const key in files) {
      const file = files[key][0];

      // ✅ Corrected usage
      const s3Url = await uploadToS3(file, 'academic');

      academicDocuments.push({
        path: s3Url,
        name: file.originalname,
        type: key,
      });
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

    res.status(200).json({
      message: "Academic documents uploaded successfully",
      data: updated
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

    const updatedApp = await Application.findOneAndUpdate(
      { user: req.user._id },
      { course, 'progress.course': true },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Course saved successfully',
      application: updatedApp,
    });
  } catch (error) {
    console.error('Error saving course:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
