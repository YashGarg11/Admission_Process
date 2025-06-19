const Application = require('../models/Application');
const sendMail = require('../utils/SendEmail');

/**
 * Get dashboard statistics for applications
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'approved' }),
      Application.countDocuments({ status: 'rejected' })
    ]);

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
      { $sort: { "_id": 1 } }
    ]);

    const revenue = approved * 5000;

    const stats = {
      total,
      pending,
      approved,
      rejected,
      revenue: `₹${(revenue / 100000).toFixed(1)}L`,
      dailyApplications,
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
    const recentApplications = await Application.find()
      .select('name email course status createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedApplications = recentApplications.map(app => {
      return {
        id: app._id,
        name: app.name,
        email: app.email,
        course: app.course || 'Not specified',
        status: app.status
          ? app.status.charAt(0).toUpperCase() + app.status.slice(1)
          : 'Unknown',
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
    const statusDistribution = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const courseDistribution = await Application.aggregate([
      { $group: { _id: "$course", count: { $sum: 1 } } }
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
 * Change application status and notify the applicant via email
 * @param {Object} req - Express request object with applicationId and status params
 * @param {Object} res - Express response object
 */
exports.changeApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Status must be pending, approved, or rejected'
      });
    }

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
    let subject = '';
    let text = '';
    let html = '';

    switch (status) {
      case 'approved':
        subject = '🎉 Congratulations! Your Application Has Been Approved';
        text = `Dear ${application.name},\nYour application for the "${application.course}" course has been approved.\n\nPlease check your dashboard.`;
        html = `
      <h2 style="color: #2d6a4f;">Congratulations, ${application.name}!</h2>
      <p>Your application for the <strong>${application.course}</strong> course has been <span style="color: green;">approved</span>.</p>
      <p>Please <a href="https://yourcollegeportal.com/login">log in</a> to view next steps.</p>
      <br>
      <p style="font-size: 0.9rem; color: #888;">Regards,<br>ABC College Admissions Team</p>
    `;
        break;

      case 'rejected':
        subject = '❌ Application Rejected - ABC College';
        text = `Dear ${application.name},\nYour application for the "${application.course}" course has been rejected.`;
        html = `
      <h2 style="color: #b02a37;">Application Update</h2>
      <p>Dear ${application.name},</p>
      <p>We regret to inform you that your application for the <strong>${application.course}</strong> course has been <span style="color: red;">rejected</span>.</p>
      <p>You may reach out for clarification.</p>
      <p style="font-size: 0.9rem; color: #888;">ABC College Admissions Team</p>
    `;
        break;

      case 'pending':
        subject = '⏳ Application Status: Pending';
        text = `Dear ${application.name},\nYour application for the "${application.course}" course is currently pending.`;
        html = `
      <h2 style="color: #0d6efd;">Application in Review</h2>
      <p>Hello ${application.name},</p>
      <p>Your application for the <strong>${application.course}</strong> course is currently marked as <strong>pending</strong>.</p>
      <p>We'll notify you as soon as a decision is made.</p>
      <p style="font-size: 0.9rem; color: #888;">Regards,<br>ABC College</p>
    `;
        break;
    }

    await sendMail(application.email, subject, text, html);


    res.status(200).json({
      success: true,
      data: application,
      message: `Application status changed to ${status} and email sent to applicant`
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
