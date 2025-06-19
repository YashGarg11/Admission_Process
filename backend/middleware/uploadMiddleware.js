const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Dynamically set resource_type to 'raw' for PDFs
    const isPdf = file.mimetype === 'application/pdf';

    return {
      folder: 'college-admission',
      allowed_formats: ['jpg', 'png', 'pdf', 'jpeg'],
      resource_type: isPdf ? 'raw' : 'image', // ⬅️ important line
    };
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (validTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Only PDF, JPG, and PNG are allowed.'), false);
    }
  }
});

module.exports = upload;
