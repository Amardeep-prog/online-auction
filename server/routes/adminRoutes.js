const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  deleteUser,
  getAllAuctionsAdmin,
  deleteAuctionAdmin,
  updateAuctionAdmin,
} = require('../controllers/adminController');

const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Apply both protect and adminOnly middleware to all routes below
router.use(protect);
router.use(adminOnly);

// User management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Auction management
router.get('/auctions', getAllAuctionsAdmin);
router.delete('/auctions/:id', deleteAuctionAdmin);
router.put('/auctions/:id', upload.single('image'), updateAuctionAdmin);

module.exports = router;
