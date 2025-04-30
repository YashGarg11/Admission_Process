const Application = require("../models/Application");

exports.submitPersonalDetails = async (req, res) => {
  try {
    const { name, email, mobile, address } = req.body;
    
    // Trim all fields to remove extra spaces
    const trimmedName = name ? name.trim() : '';
    const trimmedEmail = email ? email.trim() : '';
    const trimmedMobile = mobile ? mobile.trim() : '';
    const trimmedAddress = address ? address.trim() : '';
    
    // Check if required fields are provided
    if (!trimmedName || !trimmedEmail || !trimmedMobile || !trimmedAddress) {
      return res.status(400).json({
        message: "Missing required fields",
        details: "Name, email, mobile, and address are required"
      });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "Missing counseling letter",
        details: "Counseling letter PDF is required"
      });
    }

    const counselingLetter = req.file.path;

    // Check if user already has a pending application
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
      name,
      email,
      mobile,
      address,
      counselingLetter,
    });

    await newApplication.save();

    res.status(201).json({
      success: true,
      message: "Personal details and counseling letter submitted successfully!",
      applicationId: newApplication._id
    });
  } catch (err) {
    console.error("Error in submitPersonalDetails:", err);
    res.status(500).json({
      message: "Server error processing your application",
      error: err.message
    });
  }
};
exports.submitAcademicDetails = async (req, res) => {
  try {
    const { course, documentNames } = req.body;
    
    // Validate course
    if (!course) {
      return res.status(400).json({
        message: "Course selection is required"
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Academic documents are required"
      });
    }

    // Validate document names
    if (!documentNames) {
      return res.status(400).json({
        message: "Document names are required for each file"
      });
    }
    
    // Convert to array if it's a single value
    const namesArray = Array.isArray(documentNames) ? documentNames : [documentNames];
    
    // Check if names match number of uploaded files
    if (namesArray.length !== req.files.length) {
      return res.status(400).json({
        message: "Number of document names must match number of files",
        details: `You uploaded ${req.files.length} files but provided ${namesArray.length} names`
      });
    }
    
    // Create documents array with paths and names
    const documents = req.files.map((file, index) => ({
      path: file.path,
      name: namesArray[index]
    }));

    const application = await Application.findOne({ 
      user: req.user._id, 
      status: "pending" 
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found. Please submit personal details first"
      });
    }

    application.course = course;
    application.academicDocuments = documents;
    await application.save();

    res.status(200).json({
      success: true,
      message: "Academic details and documents submitted successfully!",
      applicationId: application._id
    });
  } catch (err) {
    console.error("Error in submitAcademicDetails:", err);
    res.status(500).json({
      message: "Server error processing your academic details",
      error: err.message 
    });
  }
};
