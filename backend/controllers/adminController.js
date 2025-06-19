const Application = require("../models/Application");
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const cloudinary = require('cloudinary').v2; // Import Cloudinary SDK

// Configure Cloudinary (ensure these environment variables are set in your .env file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Use HTTPS
});

// Handle getting all applications (admin-only)
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .select('name email phone course status createdAt')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Handle updating the status of an application (admin-only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid status value" 
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ 
        success: false,
        message: "Application not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: application,
      message: `Application status updated to ${status}`
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};
//api for finding the count of the status for the totaling
const countApplicationsByStatus = async (req, res) => {
  try {
    const counts = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    res.status(200).json({ success: true, data: counts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error counting applications", error });
  }
};

// Get a single application by ID
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .select('name email phone course status createdAt academicDocuments counselingLetter address mobile')
      .populate('user', 'email');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Format the response to include all necessary data
    const formattedApplication = {
      ...application.toObject(),
      documents: {
        counselingLetter: {
          path: application.counselingLetter,
          url: application.counselingLetter // Cloudinary URL
        },
        academicDocuments: application.academicDocuments ? application.academicDocuments.map(doc => ({
          name: doc.name,
          path: doc.path,
          url: doc.path // Cloudinary URL
        })) : []
      }
    };

    res.status(200).json({
      success: true,
      data: formattedApplication
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application details',
      error: error.message
    });
  }
};

// Download document
const downloadDocument = async (req, res) => {
  try {
    const { id, type } = req.params;
    const { path: filePath } = req.query;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'File path is required'
      });
    }

    // Verify the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Get the file name from the path
    const fileName = path.basename(filePath);

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/pdf');

    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    
    // Handle errors in the stream
    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error streaming file'
        });
      }
    });

    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading document',
      error: error.message
    });
  }
};

// Proxy for viewing documents (PDFs)
const viewProxyDocument = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Document URL is required'
      });
    }

    // Validate that the URL is from Cloudinary to prevent SSRF attacks
    if (!url.includes('cloudinary.com')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document URL'
      });
    }

    // Log the incoming URL
    console.log('Incoming URL for viewProxyDocument:', url);

    // Extract public ID from the Cloudinary URL
    const urlParts = url.split('/');
    console.log('URL Parts:', urlParts);
    const uploadIndex = urlParts.indexOf('upload');
    console.log('Upload Index:', uploadIndex);
    let publicIdWithExtension = '';

    if (uploadIndex > -1 && uploadIndex + 1 < urlParts.length) {
      const remainingParts = urlParts.slice(uploadIndex + 1);
      console.log('Remaining Parts after upload:', remainingParts);
      publicIdWithExtension = remainingParts.join('/');
    }

    // Remove version segment (e.g., v1234567890/)
    const publicId = publicIdWithExtension.replace(/^v\d+\//, '').split('.')[0];
    console.log('Extracted publicIdWithExtension:', publicIdWithExtension);
    console.log('Extracted publicId:', publicId);

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract public ID from URL'
      });
    }

    // Generate a signed URL for the private PDF
    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'raw', // Use 'raw' for non-image/video files like PDFs
      type: 'upload', // Assuming it's an uploaded asset
      secure: true,
      sign_url: true // This generates the authenticated signed URL
    });

    // Log the URL being fetched
    console.log('Attempting to fetch PDF from Cloudinary (viewProxyDocument) with signed URL:', signedUrl);

    const response = await axios.get(signedUrl, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'application/pdf'
      }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.send(response.data);
  } catch (error) {
    console.error('Error in viewProxyDocument:', error.message);
    if (error.response) {
      console.error('Cloudinary response status:', error.response.status);
      console.error('Cloudinary response data:', error.response.data.toString()); // Convert buffer to string for logging
    }
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Error proxying document for viewing',
      error: error.message
    });
  }
};

// Proxy for downloading documents (PDFs)
const downloadProxyDocument = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Document URL is required'
      });
    }

    // Validate that the URL is from Cloudinary to prevent SSRF attacks
    if (!url.includes('cloudinary.com')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document URL'
      });
    }

    // Log the incoming URL
    console.log('Incoming URL for downloadProxyDocument:', url);

    // Extract public ID from the Cloudinary URL
    const urlParts = url.split('/');
    console.log('URL Parts:', urlParts);
    const uploadIndex = urlParts.indexOf('upload');
    console.log('Upload Index:', uploadIndex);
    let publicIdWithExtension = '';

    if (uploadIndex > -1 && uploadIndex + 1 < urlParts.length) {
      const remainingParts = urlParts.slice(uploadIndex + 1);
      console.log('Remaining Parts after upload:', remainingParts);
      publicIdWithExtension = remainingParts.join('/');
    }

    const publicId = publicIdWithExtension.replace(/^v\d+\//, '').split('.')[0];
    console.log('Extracted publicIdWithExtension:', publicIdWithExtension);
    console.log('Extracted publicId:', publicId);

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract public ID from URL'
      });
    }

    // Generate a signed URL for the private PDF
    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'raw',
      type: 'upload',
      secure: true,
      sign_url: true // This generates the authenticated signed URL
    });

    // Log the URL being fetched
    console.log('Attempting to fetch PDF from Cloudinary (downloadProxyDocument) with signed URL:', signedUrl);

    const response = await axios.get(signedUrl, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'application/pdf'
      }
    });

    const fileName = path.basename(publicIdWithExtension); // Use extracted publicId with extension for filename

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(response.data);
  } catch (error) {
    console.error('Error in downloadProxyDocument:', error.message);
    if (error.response) {
      console.error('Cloudinary response status:', error.response.status);
      console.error('Cloudinary response data:', error.response.data.toString()); // Convert buffer to string for logging
    }
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Error proxying document for download',
      error: error.message
    });
  }
};

module.exports = {
  getAllApplications,
  updateApplicationStatus,
  countApplicationsByStatus,
  getApplicationById,
  downloadDocument,
  viewProxyDocument,
  downloadProxyDocument
};
