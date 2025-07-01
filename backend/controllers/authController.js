const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require('../utils/SendEmail');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, confirm_Password, mobile, address, gender, dob } = req.body;

    if (password !== confirm_Password) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create({ name, email, password, confirm_Password, mobile, address, gender, dob });

    // ✅ Generate token and set cookie
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,               // ✅ must be true for SameSite=None to work on HTTPS
      sameSite: "None",
      maxAge: 3600000 // 1 hour
    });

    await sendMail(
      newUser.email,
      "🎓 Registration Successful",
      `<h3>Hello ${newUser.name},</h3><p>Your registration was successful!</p>`
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        mobile: newUser.mobile,
        address: newUser.address,
        gender: newUser.gender,
        dob: newUser.dob,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "No user found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,               // ✅ must be true for SameSite=None to work on HTTPS
      sameSite: "None",
      maxAge: 3600000 // 1 hour
    });

    await sendMail(
      user.email,
      "🔐 Login Alert - Admission Portal",
      `<p>Hi ${user.name},</p><p>You just logged into your account. If this wasn't you, please contact support.</p>`
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// exports.logoutUser = (req, res) => {
//   try {
//     res.clearCookie("token");
//     res.status(200).json({ message: "Logout successful" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };
exports.checkSession = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
