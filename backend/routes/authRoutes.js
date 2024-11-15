const express = require('express');
const { loginUser, verifyOtp } = require('../utils/userAuthController');

const router = express.Router();

// Unified login route
router.post('/login', loginUser);

// OTP Verification Route
router.post('/verify-otp', verifyOtp);

module.exports = router;
