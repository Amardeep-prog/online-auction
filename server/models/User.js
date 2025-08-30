const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer'
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false
  },
  emailConfirmToken: String,
  emailConfirmExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  isBlocked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    avatar: String
  }
});

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate signed JWT token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
  return resetToken;
};

// Generate email confirmation token
UserSchema.methods.generateEmailConfirmToken = function () {
  const confirmToken = crypto.randomBytes(20).toString('hex');
  this.emailConfirmToken = crypto
    .createHash('sha256')
    .update(confirmToken)
    .digest('hex');
  this.emailConfirmExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hrs
  return confirmToken;
};

// Update last login timestamp
UserSchema.methods.updateLastLogin = async function () {
  this.lastLogin = Date.now();
  await this.save();
};

// Cascade delete auctions when a user is removed
UserSchema.pre('remove', async function (next) {
  await this.model('Auction').deleteMany({ seller: this._id });
  next();
});

// Static method to check if username is taken
UserSchema.statics.isUsernameTaken = async function (username) {
  const user = await this.findOne({ username });
  return !!user;
};

// Static method to check if email is taken
UserSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = User;
