// server/controllers/auctionController.js

const Auction = require('../models/Auction');
const asyncHandler = require('express-async-handler');

// @desc    Create a new auction
// @route   POST /api/v1/auctions
// @access  Private (Seller)
exports.createAuction = asyncHandler(async (req, res) => {
  const { title, description, startDate, endDate, category } = req.body;
  const image = req.file ? req.file.filename : null;

  const auction = await Auction.create({
    title,
    description,
    startDate,
    endDate,
    category,
    image,
    seller: req.user._id,
  });

  res.status(201).json({ success: true, data: auction });
});

// @desc    Get all auctions
// @route   GET /api/v1/auctions
// @access  Public
exports.getAllAuctions = asyncHandler(async (req, res) => {
  const auctions = await Auction.find();
  res.status(200).json({ success: true, data: auctions });
});

// @desc    Get single auction
// @route   GET /api/v1/auctions/:id
// @access  Public
exports.getAuctionById = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) {
    res.status(404);
    throw new Error('Auction not found');
  }
  res.status(200).json({ success: true, data: auction });
});

// @desc    Update auction
// @route   PUT /api/v1/auctions/:id
// @access  Private (Seller)
exports.updateAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) {
    res.status(404);
    throw new Error('Auction not found');
  }

  if (auction.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Unauthorized to update this auction');
  }

  const image = req.file ? req.file.filename : auction.image;

  const updatedAuction = await Auction.findByIdAndUpdate(
    req.params.id,
    { ...req.body, image },
    { new: true }
  );

  res.status(200).json({ success: true, data: updatedAuction });
});

// @desc    Delete auction
// @route   DELETE /api/v1/auctions/:id
// @access  Private (Seller)
exports.deleteAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) {
    res.status(404);
    throw new Error('Auction not found');
  }

  if (auction.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Unauthorized to delete this auction');
  }

  await auction.remove();
  res.status(200).json({ success: true, message: 'Auction deleted successfully' });
});

// @desc    Place a bid
// @route   POST /api/v1/auctions/:id/bids
// @access  Private (Buyer)
exports.placeBid = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) {
    res.status(404);
    throw new Error('Auction not found');
  }

  if (new Date() > auction.endDate) {
    res.status(400);
    throw new Error('Auction has already ended');
  }

  const bid = {
    bidder: req.user._id,
    amount: req.body.amount,
    timestamp: new Date(),
  };

  auction.bids.push(bid);
  await auction.save();

  res.status(201).json({ success: true, message: 'Bid placed successfully' });
});

// @desc    Get bid history for an auction
// @route   GET /api/v1/auctions/:id/bids
// @access  Private (Buyer/Seller)
exports.getBidHistory = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id).populate('bids.bidder', 'username');
  if (!auction) {
    res.status(404);
    throw new Error('Auction not found');
  }

  res.status(200).json({ success: true, data: auction.bids });
});

// @desc    Get buyer dashboard
// @route   GET /api/v1/auctions/dashboard/buyer
// @access  Private (Buyer)
exports.getBuyerDashboard = asyncHandler(async (req, res) => {
  const auctions = await Auction.find({ 'bids.bidder': req.user._id })
    .populate('bids.bidder', 'username');

  res.status(200).json({ success: true, data: auctions });
});

// @desc    Get seller dashboard
// @route   GET /api/v1/auctions/dashboard/seller
// @access  Private (Seller)
exports.getSellerDashboard = asyncHandler(async (req, res) => {
  const auctions = await Auction.find({ seller: req.user._id });
  res.status(200).json({ success: true, data: auctions });
});

// @desc    Get past (expired) auctions
// @route   GET /api/v1/auctions/past
// @access  Private
exports.getPastAuctions = asyncHandler(async (req, res) => {
  const pastAuctions = await Auction.find({ endDate: { $lt: new Date() } });
  res.status(200).json({ success: true, data: pastAuctions });
});

// @desc    Get winning bids for buyer
// @route   GET /api/v1/auctions/bids/winning
// @access  Private (Buyer)
exports.getWinningBids = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const endedAuctions = await Auction.find({
    'bids.0': { $exists: true },
    endDate: { $lt: new Date() },
  }).populate('bids.bidder', 'username');

  const userWinningBids = endedAuctions.filter(auction => {
    const highestBid = auction.bids.reduce((max, bid) =>
      bid.amount > max.amount ? bid : max, auction.bids[0]
    );
    return highestBid.bidder._id.toString() === userId.toString();
  });

  res.status(200).json({ success: true, data: userWinningBids });
});
