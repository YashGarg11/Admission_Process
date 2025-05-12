const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRecentApplications,
  getApplicationDistribution,
  changeApplicationStatus
} = require('../controllers/Status');

// Get dashboard statistics
router.get('/dashboard-stats', getDashboardStats);

// Get recent applications
router.get('/recent-applications', getRecentApplications);

// Get application distribution
router.get('/distribution', getApplicationDistribution);

// Change application status
router.put('/:applicationId', changeApplicationStatus);

module.exports = router;
