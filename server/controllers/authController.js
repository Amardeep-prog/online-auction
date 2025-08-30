const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already in use' });
  }

  const user = await User.create({ username, email, password, role });

  // Generate email verification token
  const confirmToken = user.generateEmailConfirmToken();

  await user.save({ validateBeforeSave: false });

  const confirmURL = `${process.env.CLIENT_URL}/confirm/${confirmToken}`;

  // Optionally send confirmation email
  // await sendEmail({
  //   email: user.email,
  //   subject: 'Email Confirmation',
  //   message: `Please confirm your email by clicking this link: ${confirmURL}`
  // });

  const token = user.getSignedJwtToken();

  // Send response with token and user info
  res.status(201).json({
    success: true,
    message: 'Registration successful. Check your email to confirm.',
    confirmURL,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  // Find user by email and select password explicitly
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Check password match
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Optional: check email confirmation status
  // if (!user.isEmailConfirmed) {
  //   return res.status(403).json({ success: false, message: 'Please confirm your email to login' });
  // }

  // Generate token
  const token = user.getSignedJwtToken();

  // Update last login
  await user.updateLastLogin();

  // Send response with token and user info
  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

// Remaining placeholder functions unchanged

exports.logout = asyncHandler(async (req, res) => {
  res.send('Logout not yet implemented');
});

exports.getMe = asyncHandler(async (req, res) => {
  res.send('Get me not yet implemented');
});

exports.sendEmailVerification = asyncHandler(async (req, res) => {
  res.send('Send email verification not yet implemented');
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  res.send('Verify email not yet implemented');
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  res.send('Forgot password not yet implemented');
});

exports.resetPassword = asyncHandler(async (req, res) => {
  res.send('Reset password not yet implemented');
});
