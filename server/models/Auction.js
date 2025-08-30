const mongoose = require('mongoose');

const AuctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  startingPrice: {
    type: Number,
    required: [true, 'Please provide a starting price'],
    min: [0, 'Price cannot be negative'],
  },
  currentPrice: {
    type: Number,
    default: function () {
      return this.startingPrice;
    },
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'art', 'electronics', 'fashion', 'home', 'sports',
      'collectibles', 'vehicles', 'other',
    ],
  },
  images: [
    {
      url: String,
      publicId: String,
      isPrimary: Boolean,
    },
  ],
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date'],
    validate: {
      validator: function (value) {
        return value > new Date();
      },
      message: 'End date must be in the future',
    },
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'ended', 'cancelled'],
    default: 'active',
  },
  bids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bid',
    },
  ],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

// Automatically update currentPrice and timestamp before saving
AuctionSchema.pre('save', function (next) {
  if (!this.currentPrice) {
    this.currentPrice = this.startingPrice;
  }
  this.updatedAt = new Date();
  next();
});

// Add text index for search functionality
AuctionSchema.index({
  title: 'text',
  description: 'text',
});

module.exports = mongoose.model('Auction', AuctionSchema);
