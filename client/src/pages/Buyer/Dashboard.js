// src/pages/Buyer/BuyerDashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CardMedia,
  Chip,
  Tabs,
  Tab,
  Box
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BuyerDashboard = () => {
  const { user, logout } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const res = await axios.get('/auctions/dashboard/buyer');
      setAuctions(res.data.auctions || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBid = async () => {
    try {
      await axios.post(`/auctions/${selectedAuction._id}/bids`, {
        amount: bidAmount,
      });
      setSelectedAuction(null);
      setBidAmount('');
      fetchAuctions();
    } catch (err) {
      console.error(err.response?.data?.message || 'Bid failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeAuctions = auctions.filter(
    (auction) => new Date(auction.endDate) > new Date()
  );

  const pastAuctions = auctions.filter(
    (auction) => new Date(auction.endDate) <= new Date()
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome, {user?.username || 'Buyer'}
          </Typography>
          <Typography variant="subtitle1">
            You are logged in as {user?.role || 'buyer'}
          </Typography>
        </Box>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
        <Tab label="Active Auctions" />
        <Tab label="Past Auctions" />
      </Tabs>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {(tab === 0 ? activeAuctions : pastAuctions).map((auction) => (
          <Grid item xs={12} sm={6} md={4} key={auction._id}>
            <Card>
              {auction.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={auction.image}
                  alt={auction.title}
                />
              )}
              <CardContent>
                <Typography variant="h6">{auction.title}</Typography>
                <Typography variant="body2">{auction.description}</Typography>
                <Chip
                  label={`Current Bid: ₹${auction.currentBid || auction.startingPrice}`}
                  color="primary"
                  sx={{ mt: 1 }}
                />
              </CardContent>
              {tab === 0 && (
                <CardActions>
                  <Button
                    onClick={() => setSelectedAuction(auction)}
                    fullWidth
                    variant="outlined"
                  >
                    Place Bid
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!selectedAuction} onClose={() => setSelectedAuction(null)}>
        <DialogTitle>Place Your Bid</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            {selectedAuction?.title} (Current Bid: ₹
            {selectedAuction?.currentBid || selectedAuction?.startingPrice})
          </Typography>
          <TextField
            fullWidth
            label="Your Bid Amount"
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedAuction(null)}>Cancel</Button>
          <Button onClick={handleBid} variant="contained">
            Submit Bid
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BuyerDashboard;
