const Application = require("../models/Application");

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

module.exports = {
  getAllApplications,
  updateApplicationStatus,
  countApplicationsByStatus,
};
