// paymentController.js - Add this to your existing controller

const Application = require('../models/Application'); // Make sure this path is correct

// Your existing getPayment function
exports.getPayment = async (req, res) => {
  try {
    const { userId } = req.params;
    const application = await Application.findOne({ user: userId });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({
      paymentStatus: application.paymentStatus,
      isApproved: application.isPaymentApproved,
      transactionId: application.transactionId,
      paymentDate: application.paymentDate,
      amount: application.amount
    });
  } catch (error) {
    console.error('Error in getPayment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// NEW: Add this function to get all payments for admin


// If you want to try with user population (use this version if the above works)
exports.getAllPaymentsWithUserInfo = async (req, res) => {
  try {
    console.log('getAllPaymentsWithUserInfo called');

    // Try with populate - make sure your User model is properly referenced
    const applications = await Application.find({})
      .populate('user', 'name email') // Make sure 'user' field exists and references User model
      .select('user paymentStatus isPaymentApproved transactionId paymentDate amount createdAt')
      .sort({ createdAt: -1 });

    console.log('Found applications with user info:', applications.length);

    const payments = applications.map(app => ({
      _id: app._id,
      userId: app.user ? app.user._id : 'Unknown',
      userName: app.user ? app.user.name : 'Unknown',
      userEmail: app.user ? app.user.email : 'Unknown',
      amount: app.amount || 0,
      status: app.isPaymentApproved ? 'approved' : (app.paymentStatus || 'pending'),
      transactionId: app.transactionId,
      paymentDate: app.paymentDate,
      createdAt: app.createdAt
    }));

    res.status(200).json(payments);

  } catch (error) {
    console.error('Error in getAllPaymentsWithUserInfo:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Your other existing functions (recordPayment, approvePayment, etc.)
// ... keep your existing functions here
exports.recordPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { transactionId, amount, status } = req.body;

    // Validate input
    if (!transactionId || !amount || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const application = await Application.findOne({ user: userId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update payment information
    application.paymentStatus = status.toLowerCase();
    application.paymentDate = new Date();
    application.transactionId = transactionId;
    application.amount = amount;
    application.isPaymentApproved = false;

    await application.save();

    return res.status(200).json({
      message: 'Payment recorded successfully',
      paymentStatus: application.paymentStatus,
      transactionId: application.transactionId,
      amount: application.amount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin approve payment function
exports.approvePayment = async (req, res) => {
  try {
    const { userId } = req.params;
    const { approved } = req.body;

    const application = await Application.findOne({ user: userId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.isPaymentApproved = approved;
    await application.save();

    res.status(200).json({
      message: `Payment ${approved ? 'approved' : 'rejected'} successfully`,
      isPaymentApproved: application.isPaymentApproved
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};