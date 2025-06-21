const Application = require("../models/Application");
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const cloudinary = require('cloudinary').v2; // Import Cloudinary SDK
const User = require("../models/User");
const sendMail = require('../utils/SendEmail');

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

    // Send email notification
    let subject = '';
    let html = '';

    switch (status) {
      case 'approved':
        subject = '🎉 Congratulations! Your Application Has Been Approved - ABC College';
        html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2d6a4f; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
              <p style="color: #6c757d; margin: 10px 0 0 0; font-size: 16px;">Your Application Has Been Approved</p>
            </div>
            
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h2 style="color: #155724; margin: 0 0 15px 0; font-size: 22px;">Dear ${application.name},</h2>
              <p style="color: #155724; margin: 0; line-height: 1.6; font-size: 16px;">
                We are delighted to inform you that your application for the <strong>${application.course}</strong> course has been <strong style="color: #28a745;">APPROVED</strong>!
              </p>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px;">Next Steps:</h3>
              <ul style="color: #495057; line-height: 1.6; font-size: 16px; padding-left: 20px;">
                <li>Complete your enrollment process within 7 days</li>
                <li>Submit required documents and fees</li>
                <li>Attend the orientation session</li>
                <li>Prepare for your academic journey</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://yourcollegeportal.com/login" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Access Your Portal</a>
            </div>
            
            <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6c757d; margin: 0; font-size: 14px; text-align: center;">
                <strong>ABC College Admissions Team</strong><br>
                Email: admissions@abccollege.edu<br>
                Phone: +1 (555) 123-4567<br>
                <br>
                <em>Welcome to the ABC College family! 🎓</em>
              </p>
            </div>
          </div>
        </div>
        `;
        break;

      case 'rejected':
        subject = '❌ Application Status Update - ABC College';
        html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #721c24; margin: 0; font-size: 28px;">Application Update</h1>
              <p style="color: #6c757d; margin: 10px 0 0 0; font-size: 16px;">Important Information Regarding Your Application</p>
            </div>
            
            <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h2 style="color: #721c24; margin: 0 0 15px 0; font-size: 22px;">Dear ${application.name},</h2>
              <p style="color: #721c24; margin: 0; line-height: 1.6; font-size: 16px;">
                We regret to inform you that after careful review, your application for the <strong>${application.course}</strong> course has been <strong style="color: #dc3545;">NOT APPROVED</strong> for the current academic session.
              </p>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px;">What This Means:</h3>
              <ul style="color: #495057; line-height: 1.6; font-size: 16px; padding-left: 20px;">
                <li>Your application does not meet the current admission criteria</li>
                <li>You may reapply for future sessions</li>
                <li>Consider alternative courses or programs</li>
                <li>We encourage you to improve your qualifications</li>
              </ul>
            </div>
            
            <div style="background-color: #e2e3e5; border: 1px solid #d6d8db; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #495057; margin: 0 0 10px 0; font-size: 16px;">Need Help?</h3>
              <p style="color: #495057; margin: 0; line-height: 1.6; font-size: 14px;">
                Our admissions counselors are available to discuss your options and provide guidance for future applications.
              </p>
            </div>
            
            <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6c757d; margin: 0; font-size: 14px; text-align: center;">
                <strong>ABC College Admissions Team</strong><br>
                Email: admissions@abccollege.edu<br>
                Phone: +1 (555) 123-4567<br>
                <br>
                <em>We appreciate your interest in ABC College.</em>
              </p>
            </div>
          </div>
        </div>
        `;
        break;

      case 'pending':
        subject = '⏳ Application Status: Under Review - ABC College';
        html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0d6efd; margin: 0; font-size: 28px;">Application Under Review</h1>
              <p style="color: #6c757d; margin: 10px 0 0 0; font-size: 16px;">Your Application is Being Processed</p>
            </div>
            
            <div style="background-color: #cce7ff; border: 1px solid #b3d9ff; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h2 style="color: #0d6efd; margin: 0 0 15px 0; font-size: 22px;">Hello ${application.name},</h2>
              <p style="color: #0d6efd; margin: 0; line-height: 1.6; font-size: 16px;">
                Your application for the <strong>${application.course}</strong> course is currently <strong>UNDER REVIEW</strong> by our admissions committee.
              </p>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px;">What Happens Next:</h3>
              <ul style="color: #495057; line-height: 1.6; font-size: 16px; padding-left: 20px;">
                <li>Our team is carefully reviewing your application</li>
                <li>All submitted documents are being verified</li>
                <li>We will notify you as soon as a decision is made</li>
                <li>This process typically takes 5-10 business days</li>
              </ul>
            </div>
            
            <div style="background-color: #e2e3e5; border: 1px solid #d6d8db; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #495057; margin: 0 0 10px 0; font-size: 16px;">Stay Updated:</h3>
              <p style="color: #495057; margin: 0; line-height: 1.6; font-size: 14px;">
                You can check your application status anytime by logging into your student portal. We'll also send you an email notification once the review is complete.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://yourcollegeportal.com/login" style="background-color: #0d6efd; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Check Application Status</a>
            </div>
            
            <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6c757d; margin: 0; font-size: 14px; text-align: center;">
                <strong>ABC College Admissions Team</strong><br>
                Email: admissions@abccollege.edu<br>
                Phone: +1 (555) 123-4567<br>
                <br>
                <em>Thank you for your patience during this process.</em>
              </p>
            </div>
          </div>
        </div>
        `;
        break;
    }

    console.log("📧 Preparing to send status change email...");
    console.log("TO:", application.email);
    console.log("SUBJECT:", subject);

    // Try to send email, but don't fail the entire operation if email fails
    let emailSent = false;
    let emailError = null;
    
    try {
      await sendMail(application.email, subject, html);
      emailSent = true;
      console.log("✅ Status change email sent successfully");
    } catch (emailErr) {
      emailError = emailErr.message;
      console.error("⚠️ Email sending failed, but status was updated:", emailErr.message);
      // Continue with the operation even if email fails
    }

    const response = {
      success: true,
      data: application,
      message: `Application status updated to ${status}`,
      email: {
        sent: emailSent,
        error: emailError
      }
    };

    if (emailSent) {
      response.message += " and email sent to applicant";
    } else {
      response.message += " (email notification failed)";
    }

    res.status(200).json(response);
  } catch (err) {
    console.error('Status update error:', err);
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
