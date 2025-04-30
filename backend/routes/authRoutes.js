const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const passport = require('passport');
const { googleAuthCallback, githubAuthCallback, facebookAuthCallback } = require("../controllers/authController")

router.post("/register", registerUser);
router.post("/login", loginUser);


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', googleAuthCallback);


module.exports = router;
