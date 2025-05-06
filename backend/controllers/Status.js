const Application = require('../models/Application');

/**
 * Get dashboard statistics for applications
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts of applications by status
    const [total, pending, approved, rejected] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'approved' }),
      Application.countDocuments({ status: 'rejected' })
    ]);

    // Get application trends by day for current week
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const dailyApplications = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: oneWeekAgo, $lte: today }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Calculate revenue (assuming ₹5000 per approved application)
    const revenue = approved * 5000;

    // Create a response with all stats
    const stats = {
      total,
      pending,
      approved,
      rejected,
      revenue: `₹${(revenue / 100000).toFixed(1)}L`, // Format as ₹X.XL
      dailyApplications,
      // Calculate growth rates (mock data for now)
      growth: {
        total: 12,
        pending: 8,
        approved: 22,
        revenue: 18
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

/**
 * Get recent applications for dashboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRecentApplications = async (req, res) => {
  try {
    // Get 5 most recent applications with necessary fields
    const recentApplications = await Application.find()
      .select('name email course status createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Format the applications data to match frontend requirements
    const formattedApplications = recentApplications.map(app => {
      return {
        id: app._id,
        name: app.name,
        email: app.email,
        course: app.course || 'Not specified',
        status: app.status.charAt(0).toUpperCase() + app.status.slice(1), // Capitalize status
        date: formatDate(app.createdAt)
      };
    });

    res.status(200).json({
      success: true,
      data: formattedApplications
    });
  } catch (error) {
    console.error('Recent applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent applications',
      error: error.message
    });
  }
};

/**
 * Get application distribution metrics by status and course
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getApplicationDistribution = async (req, res) => {
  try {
    // Get distribution by status
    const statusDistribution = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get distribution by course
    const courseDistribution = await Application.aggregate([
      {
        $group: {
          _id: "$course",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        byStatus: statusDistribution,
        byCourse: courseDistribution
      }
    });
  } catch (error) {
    console.error('Application distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application distribution',
      error: error.message
    });
  }
};

/**
 * Format date to be displayed in the frontend
 * @param {Date} date - Date object to format
 * @returns {String} Formatted date string (e.g., "04 May 2025")
 */
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Change application status
 * @param {Object} req - Express request object with applicationId and status params
 * @param {Object} res - Express response object
 */
exports.changeApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Status must be pending, approved, or rejected'
      });
    }

    // Update application status
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application,
      message: `Application status changed to ${status}`
    });
  } catch (error) {
    console.error('Status change error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing application status',
      error: error.message
    });
  }
};

module.exports = exports;