
const Application = require("../models/Application");
const cloudinary = require("cloudinary").v2;
const upload = require("../middleware/uploadMideeleware");

exports.submitPersonalDetails = async (req, res) => {
  try {
    const { name, email, mobile, address } = req.body;
    const counselingLetter = req.file.path;
    const newApplication = new Application({
      user: req.user._id,
      name,
      email,
      mobile,
      address,
      counselingLetter,
    });

    await newApplication.save();
    res.status(201).json({ message: "Personal details and counseling letter submitted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitAcademicDetails = async (req, res) => {
  try {
    const { course, academicDocuments } = req.body;
    const documents = req.files.map(file => file.path);  // All document URLs from Cloudinary

    const application = await Application.findOne({ user: req.user._id, status: "pending" });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.course = course;
    application.academicDocuments = documents;  // Add academic documents in the form of as we want because multer use single or array both
    await application.save();

    res.status(200).json({ message: "Academic details and documents submitted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};