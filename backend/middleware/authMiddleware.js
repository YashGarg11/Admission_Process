const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token; // 🧠 Use cookie instead of Authorization header
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token in cookies" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed or expired" });
  }
};

// ✅ Role-based guard (unchanged)
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied, not admin" });
  }
  next();
};

module.exports = { protect, isAdmin };
