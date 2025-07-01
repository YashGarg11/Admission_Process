const express = require('express');
const router = express.Router();

const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  getPayment,
  recordPayment,
  approvePayment,
  getAllPayments, getAllPaymentsWithUserInfo,
} = require('../controllers/paymentController');

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`Payment Route: ${req.method} ${req.path}`);
  console.log('User:', req.user ? req.user._id : 'Not authenticated');
  next();
});

// Get payment info for current user
router.get('/me', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const mockReq = { params: { userId } };
    return await getPayment(mockReq, res);
  } catch (error) {
    console.error('Error in /me route:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get payment info for specific user
router.get('/:userId', protect, getPayment);

router.get('/admin/all', protect, isAdmin, async (req, res) => {
  try {
    console.log('Admin all payments route hit');
    console.log('User role:', req.user.role);
    return await getAllPaymentsWithUserInfo(req, res); // ✅ call correct function
  } catch (error) {
    console.error('Error in /admin/all route:', error);
    return res.status(500).json({
      message: 'Server error in admin/all route',
      error: error.message
    });
  }
});

// Get ALL payments (admin only) - with better error handling
router.get('/admin/all', protect, isAdmin, async (req, res) => {
  try {
    console.log('Admin all payments route hit');
    console.log('User role:', req.user.role); // Debug log
    return await getAllPayments(req, res);
  } catch (error) {
    console.error('Error in /admin/all route:', error);
    return res.status(500).json({
      message: 'Server error in admin/all route',
      error: error.message
    });
  }
});

// Record payment
router.post('/student/payment', protect, recordPayment);

// Admin approve payment  
router.post('/admin/payment/approve/:userId', protect, isAdmin, approvePayment);

// Admin reject payment
router.post('/admin/payment/reject/:userId', protect, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Rejecting payment for user:', userId);

    // Make sure you have the Application model imported
    const Application = require('../models/Application'); // Adjust path as needed

    const application = await Application.findOneAndUpdate(
      { user: userId },
      {
        paymentStatus: 'rejected',
        isPaymentApproved: false
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Payment rejected successfully' });
  } catch (error) {
    console.error('Error rejecting payment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;