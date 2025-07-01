const multer = require('multer');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/awsS3');

const storage = multer.memoryStorage(); // store file in memory
const upload = multer({ storage });

const uploadToS3 = async (file, folder = 'admission') => {
  const timestamp = Date.now();
  const key = `${folder}/${timestamp}_${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ✅ Remove this line to avoid ACL error
    // ACL: 'public-read',
  });

  await s3.send(command);

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

module.exports = {
  upload,
  uploadToS3,
};
