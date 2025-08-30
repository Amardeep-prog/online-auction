const express = require('express');
const router = express.Router();

const {
  createAuction,
  getAllAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction,
  placeBid,
  getBuyerDashboard,
  getSellerDashboard,
  getWinningBids,
  getBidHistory,
  getPastAuctions,
} = require('../controllers/auctionController');

const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ✅ Public routes
router.get('/', getAllAuctions);
router.get('/:id', getAuctionById);

// ✅ Protected auction routes
router.post('/', protect, upload.single('image'), createAuction);
router.put('/:id', protect, upload.single('image'), updateAuction);
router.delete('/:id', protect, deleteAuction);
router.post('/:id/bid', protect, placeBid);

// ✅ Dashboard routes
router.get('/buyer/dashboard', protect, getBuyerDashboard);
router.get('/seller/dashboard', protect, getSellerDashboard);

// ✅ Buyer-specific auction info
router.get('/buyer/winning-bids', protect, getWinningBids);
router.get('/buyer/bid-history', protect, getBidHistory);
router.get('/buyer/past-auctions', protect, getPastAuctions);

module.exports = router;
