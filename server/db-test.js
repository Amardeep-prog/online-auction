const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/online-auction')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));