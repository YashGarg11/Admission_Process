const Application = require("../models/Application");

// Controller to handle submitting a new application
const submitApplication = async (req, res) => {
  try {
    const { course, marks, document } = req.body;

    const newApp = new Application({
      user: req.user.id, // from token
      course,
      marks,
      document,
    });

    await newApp.save();
    res.status(201).json({ message: "Application Submitted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to handle fetching current user's application
const getMyApplication = async (req, res) => {
  try {
    const application = await Application.findOne({ user: req.user.id });
    if (!application) {
      return res.status(404).json({ message: "No application found" });
    }
    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  submitApplication,
  getMyApplication,
};
