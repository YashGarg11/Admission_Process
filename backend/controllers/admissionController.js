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
    const { course, documentNames, documentTypes } = req.body;
    
    // Debug data received
    console.log('Received course:', course);
    console.log('Received document names:', documentNames);
    console.log('Received document types:', documentTypes);
    console.log('Files received:', req.files ? JSON.stringify(req.files) : 'No files');
    
    // Validate course
    if (!course) {
      return res.status(400).json({
        message: "Course selection is required"
      });
    }

    // With upload.fields, files are organized by field name
    const documentFiles = req.files && req.files.documents ? req.files.documents : [];
    
    if (documentFiles.length === 0) {
      return res.status(400).json({
        message: "Academic documents are required"
      });
    }

    // Parse JSON strings for document names and types
    let namesArray = [];
    let typesArray = [];
    
    try {
      namesArray = JSON.parse(documentNames);
      typesArray = documentTypes ? JSON.parse(documentTypes) : [];
      
      // Log parsed arrays for debugging
      console.log('Parsed names array:', namesArray);
      console.log('Parsed types array:', typesArray);
    } catch (error) {
      return res.status(400).json({
        message: "Invalid document names or types format",
        details: error.message
      });
    }
    
    // Check if names match number of uploaded files
    if (namesArray.length !== documentFiles.length) {
      return res.status(400).json({
        message: "Number of document names must match number of files",
        details: `You uploaded ${documentFiles.length} files but provided ${namesArray.length} names`
      });
    }
    
    // Create documents array with paths and names - fixed mapping
    const documents = documentFiles.map((file, index) => {
      console.log(`Processing file #${index+1}:`, file.originalname);
      console.log(`  - Assigning name: "${namesArray[index]}"`);
      console.log(`  - Assigning type: "${typesArray[index] || 'other'}"`);
      
      return {
        path: file.path,
        name: namesArray[index],
        type: typesArray[index] || 'other'
      };
    });

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
    
    // Log what's being saved
    console.log('Saving application with documents:', JSON.stringify(application.academicDocuments));
    
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
