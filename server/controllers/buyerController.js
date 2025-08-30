// auction_app/server/controllers/buyerController.js

const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const User = require('../models/User');
const Purchase = require('../models/Purchase');
const asyncHandler = require('express-async-handler');

// 📦 Browse all active auctions
exports.getAllAuctions = asyncHandler(async (req, res) => {
  const auctions = await Auction.find({ endDate: { $gt: new Date() } });
  res.status(200).json({ success: true, auctions });
});

// Add this in buyerController.js

exports.getBuyerAuctions = asyncHandler(async (req, res) => {
  // Fetch all auctions with bids populated
  const auctions = await Auction.find()
    .populate({
      path: 'bids.bidder',
      select: '_id name email'  // minimal user info
    })
    .lean();

  res.status(200).json({ success: true, auctions });
});


// 📦 Get single auction details
exports.getAuctionDetails = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) return res.status(404).json({ success: false, message: 'Auction not found' });
  res.status(200).json({ success: true, auction });
});

// 💰 Place a bid
exports.placeBid = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || !req.user || !req.user._id) {
    return res.status(400).json({ success: false, message: 'Amount and user are required' });
  }

  const auction = await Auction.findById(req.params.id);
  if (!auction || new Date() > auction.endDate) {
    return res.status(400).json({ success: false, message: 'Auction is not active' });
  }

  const bid = await Bid.create({
    bidder: req.user._id,
    auction: auction._id,
    amount
  });

  res.status(201).json({ success: true, bid });
});

// 📜 Get bid history
// controllers/buyerController.js
exports.getBidHistory = asyncHandler(async (req, res) => {
  const bids = await Bid.find({ bidder: req.user._id }).populate('auction');
  res.status(200).json({ success: true, bids });
});

// ⭐ Add to watchlist
exports.addToWatchlist = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { watchlist: req.params.auctionId }
  });
  res.status(200).json({ success: true, message: 'Added to watchlist' });
});

// ❌ Remove from watchlist
exports.removeFromWatchlist = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { watchlist: req.params.auctionId }
  });
  res.status(200).json({ success: true, message: 'Removed from watchlist' });
});

// 👀 Get user's watchlist
exports.getWatchlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('watchlist');
  res.status(200).json({ success: true, watchlist: user.watchlist });
});

// 💳 Initiate checkout (placeholder)
exports.initiateCheckout = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: 'Checkout initiated (placeholder)' });
});

// 🛍️ Get purchase history
exports.getPurchaseHistory = asyncHandler(async (req, res) => {
  const purchases = await Purchase.find({ buyer: req.user._id }).populate('auction');
  res.status(200).json({ success: true, purchases });
});

// 👤 Get buyer profile
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.status(200).json({ success: true, user });
});

// ✏️ Update buyer profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true
  }).select('-password');
  res.status(200).json({ success: true, user: updatedUser });
});
