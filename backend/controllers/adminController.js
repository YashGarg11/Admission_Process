const Application = require("../models/Application");

// Handle getting all applications (admin-only)
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate('user', 'name email');
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Handle updating the status of an application (admin-only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    
    const application = await Application.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllApplications,
  updateApplicationStatus,
};
