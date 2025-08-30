const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');
const { protect, authorize } = require('../middleware/auth');

// 📦 Browse auctions
router.get('/auctions', buyerController.getAllAuctions);
router.get('/auctions/:id', buyerController.getAuctionDetails);

// 🔨 Bidding
router.post(
  '/auctions/:id/bid',
  protect,
  authorize('buyer'),
  buyerController.placeBid
);

// 🔍 Buyer auctions for dashboard frontend (NEW)
router.get(
  '/auctions/buyer',
  protect,
  authorize('buyer'),
  buyerController.getBuyerAuctions  // <-- you implement this in buyerController.js
);

// 📜 Bid history
router.get(
  '/bids/history',
  protect,
  authorize('buyer'),
  buyerController.getBidHistory
);

// 👁️ Watchlist
router.post(
  '/watchlist/:auctionId',
  protect,
  authorize('buyer'),
  buyerController.addToWatchlist
);
router.delete(
  '/watchlist/:auctionId',
  protect,
  authorize('buyer'),
  buyerController.removeFromWatchlist
);
router.get(
  '/watchlist',
  protect,
  authorize('buyer'),
  buyerController.getWatchlist
);

// 💳 Checkout and purchases
router.post(
  '/checkout',
  protect,
  authorize('buyer'),
  buyerController.initiateCheckout
);
router.get(
  '/purchases',
  protect,
  authorize('buyer'),
  buyerController.getPurchaseHistory
);

// 👤 Profile
router.get(
  '/profile',
  protect,
  authorize('buyer'),
  buyerController.getProfile
);
router.put(
  '/profile',
  protect,
  authorize('buyer'),
  buyerController.updateProfile
);

module.exports = router;
