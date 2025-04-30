const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, confirm_Password, mobile, address, gender, dob } = req.body;

    if (password !== confirm_Password) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create({ name, email, password, confirm_Password, mobile, address, gender, dob, });

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

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
        token
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};




exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "No user found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
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

// New functions for social login

// Handle Google authentication success
exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', async (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Authentication failed" });

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile || '',
        avatar: user.avatar || ''
      }
    });
  })(req, res, next);
};

// Generic social auth success handler (alternative approach)
exports.socialAuthSuccess = (req, res) => {
  // Generate JWT token for the authenticated user
  const token = jwt.sign(
    { id: req.user._id, role: req.user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // Return user data and token
  res.status(200).json({
    token,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email || '',
      role: req.user.role,
      mobile: req.user.mobile || '',
      avatar: req.user.avatar || ''
    }
  });
};