const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const { protect } = require('../middleware/authMiddleware');
const passport = require('passport');

const { googleAuthCallback, githubAuthCallback, facebookAuthCallback } = require("../controllers/authController")

router.post("/register", registerUser);

router.post("/login", loginUser);
router.get('/check-session', protect, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    res.status(200).json({ user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error checking session' });
  }
});



// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/google/callback', googleAuthCallback);


module.exports = router;
