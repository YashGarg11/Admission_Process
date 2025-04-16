const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  course: {
    type: String,
    required: true

  },
  marks: {
    type: String,
    required: true
  },
  document: {
    type: String
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
},
  {
    timestamps: true
  });

module.exports = mongoose.model("Application", applicationSchema);