const nodemailer = require('nodemailer');

const sendMail = async (to, subject, html) => {
  try {
    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email configuration missing. Please set EMAIL_USER and EMAIL_PASS in your .env file');
    }

    // Validate email parameters
    if (!to || !subject || !html) {
      throw new Error('Missing required email parameters: to, subject, or html');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error(`Invalid email address: ${to}`);
    }

    console.log("📧 Email configuration check:");
    console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Missing");
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing");

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add timeout and connection settings
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000,   // 30 seconds
      socketTimeout: 60000,     // 60 seconds
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log("✅ Email transporter verified successfully");

    const mailOptions = {
      from: `"Admission Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    console.log("📧 Sending email to:", to);
    console.log("📧 Subject:", subject);

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}`);
    console.log("📧 Message ID:", result.messageId);
    
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    
    // Provide specific error messages for common issues
    if (error.code === 'EAUTH') {
      console.error("🔐 Authentication failed. Please check:");
      console.error("   - Your Gmail username and password are correct");
      console.error("   - You're using an App Password (not regular password)");
      console.error("   - 2-Factor Authentication is enabled on your Gmail account");
      console.error("   - Less secure app access is enabled (if not using App Password)");
    } else if (error.code === 'ECONNECTION') {
      console.error("🌐 Connection failed. Please check:");
      console.error("   - Your internet connection");
      console.error("   - Gmail SMTP server is accessible");
    } else if (error.message.includes('Email configuration missing')) {
      console.error("⚙️ Configuration error. Please add to your .env file:");
      console.error("   EMAIL_USER=your-email@gmail.com");
      console.error("   EMAIL_PASS=your-app-password");
    }
    
    throw error;
  }
};

module.exports = sendMail;
