const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const { authenticate, authorizeSeller } = require('../middleware/auth');
const upload = require('../middleware/upload');

// TEST what exactly is being exported
console.log('upload type:', typeof upload);
console.log('upload.array:', typeof upload.array); // <--- add this
console.log('createAuction type:', typeof sellerController.createAuction);

// Test route to isolate problem
router.post('/test', (req, res) => res.send('OK'));

module.exports = router;
