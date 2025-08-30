const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Auction = require('../models/Auction');

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// @desc    Delete a user
// @route   DELETE /api/v1/admin/users/:id
// @access  Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.deleteOne();
  res.json({ message: 'User deleted' });
});

// @desc    Get all auctions
// @route   GET /api/v1/admin/auctions
// @access  Admin
const getAllAuctionsAdmin = asyncHandler(async (req, res) => {
  const auctions = await Auction.find().populate('seller', 'username email');
  res.json(auctions);
});

// @desc    Update an auction
// @route   PUT /api/v1/admin/auctions/:id
// @access  Admin
const updateAuctionAdmin = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) {
    res.status(404);
    throw new Error('Auction not found');
  }

  const { title, description, startingPrice, endDate, category } = req.body;

  auction.title = title || auction.title;
  auction.description = description || auction.description;
  auction.startingPrice = startingPrice || auction.startingPrice;
  auction.endDate = endDate || auction.endDate;
  auction.category = category || auction.category;

  // Handle optional image upload
  if (req.file) {
    const image = {
      url: `/uploads/${req.file.filename}`,
      publicId: req.file.filename,
      isPrimary: true,
    };
    auction.images = [image];
  }

  const updatedAuction = await auction.save();
  res.json(updatedAuction);
});

// @desc    Delete an auction
// @route   DELETE /api/v1/admin/auctions/:id
// @access  Admin
const deleteAuctionAdmin = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) {
    res.status(404);
    throw new Error('Auction not found');
  }
  await auction.deleteOne();
  res.json({ message: 'Auction deleted' });
});

// @desc    Get admin stats
// @route   GET /api/v1/admin/stats
// @access  Admin
const getAdminStats = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments();
  const auctionsCount = await Auction.countDocuments();
  res.json({ usersCount, auctionsCount });
});

module.exports = {
  getAllUsers,
  deleteUser,
  getAllAuctionsAdmin,
  updateAuctionAdmin,
  deleteAuctionAdmin,
  getAdminStats,
};
