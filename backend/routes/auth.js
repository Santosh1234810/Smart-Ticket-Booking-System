const express = require('express');
const router = express.Router();
const {
  signup,
  verifyOTP,
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validation');

// Public routes
router.post('/signup/', validateSignup, signup);
router.post('/verify-otp/', verifyOTP);
router.post('/login/', validateLogin, login);
router.post('/forgot-password/', forgotPassword);
router.post('/reset-password/', resetPassword);

module.exports = router;
