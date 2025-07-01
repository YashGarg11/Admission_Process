// models/Application.js
const mongoose = require('mongoose');

// Define a schema for academic documents that includes both path and name
const academicDocumentSchema = new mongoose.Schema({
  path: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, default: 'other' }
});

const CounsellingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true, match: [/^\d{10}$/, "Mobile number must be 10 digits"] },
  counselingLetter: { type: String, required: true },
  address: { type: String, required: true },
  course: { type: String },
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    default: null
  },
  amount: {
    type: Number,
    default: null
  },
  paymentDate: {
    type: Date,
    default: null
  },
  isPaymentApproved: {
    type: Boolean,
    default: false
  },
  // Use the academicDocumentSchema for storing documents with their names
  academicDocuments: [academicDocumentSchema],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: "pending" },
  progress: {
    course: { type: Boolean, default: false },
    personal: { type: Boolean, default: false },
    academic: { type: Boolean, default: false },
  },
  idCardUrl: {
    type: String,
    default: null
  },
}, { timestamps: true });

module.exports = mongoose.model("Application", CounsellingSchema);
