const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyEmail,
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

// Email verification
router.post('/verify-email', sendEmailVerification);
router.get('/verify-email/:token', verifyEmail);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
