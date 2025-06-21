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
        subject = '🎉 Congratulations! Your Application Has Been Approved - ABC College';
        html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2d6a4f; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
              <p style="color: #6c757d; margin: 10px 0 0 0; font-size: 16px;">Your Application Has Been Approved</p>
            </div>
            
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h2 style="color: #155724; margin: 0 0 15px 0; font-size: 22px;">Dear ${application.name},</h2>
              <p style="color: #155724; margin: 0; line-height: 1.6; font-size: 16px;">
                We are delighted to inform you that your application for the <strong>${application.course}</strong> course has been <strong style="color: #28a745;">APPROVED</strong>!
              </p>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px;">Next Steps:</h3>
              <ul style="color: #495057; line-height: 1.6; font-size: 16px; padding-left: 20px;">
                <li>Complete your enrollment process within 7 days</li>
                <li>Submit required documents and fees</li>
                <li>Attend the orientation session</li>
                <li>Prepare for your academic journey</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://yourcollegeportal.com/login" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Access Your Portal</a>
            </div>
            
            <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6c757d; margin: 0; font-size: 14px; text-align: center;">
                <strong>ABC College Admissions Team</strong><br>
                Email: admissions@abccollege.edu<br>
                Phone: +1 (555) 123-4567<br>
                <br>
                <em>Welcome to the ABC College family! 🎓</em>
              </p>
            </div>
          </div>
        </div>
        `;
        break;

      case 'rejected':
        subject = '❌ Application Status Update - ABC College';
        html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #721c24; margin: 0; font-size: 28px;">Application Update</h1>
              <p style="color: #6c757d; margin: 10px 0 0 0; font-size: 16px;">Important Information Regarding Your Application</p>
            </div>
            
            <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h2 style="color: #721c24; margin: 0 0 15px 0; font-size: 22px;">Dear ${application.name},</h2>
              <p style="color: #721c24; margin: 0; line-height: 1.6; font-size: 16px;">
                We regret to inform you that after careful review, your application for the <strong>${application.course}</strong> course has been <strong style="color: #dc3545;">NOT APPROVED</strong> for the current academic session.
              </p>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px;">What This Means:</h3>
              <ul style="color: #495057; line-height: 1.6; font-size: 16px; padding-left: 20px;">
                <li>Your application does not meet the current admission criteria</li>
                <li>You may reapply for future sessions</li>
                <li>Consider alternative courses or programs</li>
                <li>We encourage you to improve your qualifications</li>
              </ul>
            </div>
            
            <div style="background-color: #e2e3e5; border: 1px solid #d6d8db; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #495057; margin: 0 0 10px 0; font-size: 16px;">Need Help?</h3>
              <p style="color: #495057; margin: 0; line-height: 1.6; font-size: 14px;">
                Our admissions counselors are available to discuss your options and provide guidance for future applications.
              </p>
            </div>
            
            <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6c757d; margin: 0; font-size: 14px; text-align: center;">
                <strong>ABC College Admissions Team</strong><br>
                Email: admissions@abccollege.edu<br>
                Phone: +1 (555) 123-4567<br>
                <br>
                <em>We appreciate your interest in ABC College.</em>
              </p>
            </div>
          </div>
        </div>
        `;
        break;

      case 'pending':
        subject = '⏳ Application Status: Under Review - ABC College';
        html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0d6efd; margin: 0; font-size: 28px;">Application Under Review</h1>
              <p style="color: #6c757d; margin: 10px 0 0 0; font-size: 16px;">Your Application is Being Processed</p>
            </div>
            
            <div style="background-color: #cce7ff; border: 1px solid #b3d9ff; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h2 style="color: #0d6efd; margin: 0 0 15px 0; font-size: 22px;">Hello ${application.name},</h2>
              <p style="color: #0d6efd; margin: 0; line-height: 1.6; font-size: 16px;">
                Your application for the <strong>${application.course}</strong> course is currently <strong>UNDER REVIEW</strong> by our admissions committee.
              </p>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px;">What Happens Next:</h3>
              <ul style="color: #495057; line-height: 1.6; font-size: 16px; padding-left: 20px;">
                <li>Our team is carefully reviewing your application</li>
                <li>All submitted documents are being verified</li>
                <li>We will notify you as soon as a decision is made</li>
                <li>This process typically takes 5-10 business days</li>
              </ul>
            </div>
            
            <div style="background-color: #e2e3e5; border: 1px solid #d6d8db; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #495057; margin: 0 0 10px 0; font-size: 16px;">Stay Updated:</h3>
              <p style="color: #495057; margin: 0; line-height: 1.6; font-size: 14px;">
                You can check your application status anytime by logging into your student portal. We'll also send you an email notification once the review is complete.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://yourcollegeportal.com/login" style="background-color: #0d6efd; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Check Application Status</a>
            </div>
            
            <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6c757d; margin: 0; font-size: 14px; text-align: center;">
                <strong>ABC College Admissions Team</strong><br>
                Email: admissions@abccollege.edu<br>
                Phone: +1 (555) 123-4567<br>
                <br>
                <em>Thank you for your patience during this process.</em>
              </p>
            </div>
          </div>
        </div>
        `;
        break;
    }
    console.log("📧 Preparing to send email...");
    console.log("TO:", application.email);
    console.log("SUBJECT:", subject);
    // Optionally log part of `html`

    await sendMail(application.email, subject, html);
    console.log("✅ Email sent call completed");

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
