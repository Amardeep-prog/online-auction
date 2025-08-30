const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Allow all origins (for development only)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// ❌ Removed CORS origin restrictions block

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/authRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/auctions', auctionRoutes);
app.use('/api/v1/admin', adminRoutes);

// ✅ Socket.IO still allows specific origins for now
const io = new Server(server, {
  cors: {
    origin: '*', // or use allowedOrigins if needed
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('🔌 A user connected:', socket.id);

  socket.on('bidPlaced', (data) => {
    io.emit('bidUpdate', data); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/online-auction';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
