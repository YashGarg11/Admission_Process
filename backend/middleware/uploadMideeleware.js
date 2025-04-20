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

const upload = multer({ storage });

module.exports = upload;
