const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'college-admission', // Folder name on Cloudinary
    allowed_formats: ['jpg', 'png', 'pdf', 'jpeg'], // allowed file types
  }
});

// Set file size limits and improve error handling
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file types
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Only PDF, JPG, and PNG are allowed.'), false);
    }
  }
});

module.exports = upload; 