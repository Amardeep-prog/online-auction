const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auction',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    purchasedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Purchase', purchaseSchema);
