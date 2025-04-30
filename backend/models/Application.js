// models/Application.js
const mongoose = require('mongoose');

// Define a schema for academic documents that includes both path and name
const academicDocumentSchema = new mongoose.Schema({
  path: { type: String, required: true },
  name: { type: String, required: true },
});

const CounsellingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true, match: [/^\d{10}$/, "Mobile number must be 10 digits"] },
  counselingLetter: { type: String, required: true },
  address: { type: String, required: true },
  course: { type: String },
  // Use the academicDocumentSchema for storing documents with their names
  academicDocuments: [academicDocumentSchema],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: "pending" },
  idCardUrl: {
    type: String,
    default: null
  },
}, { timestamps: true });

module.exports = mongoose.model("Application", CounsellingSchema);
