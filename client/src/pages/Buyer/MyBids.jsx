// src/pages/Buyer/MyBids.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axios.get('/api/v1/auctions/bids/winning');
        setBids(res.data.data);
      } catch (err) {
        console.error('Failed to fetch bids:', err);
      }
    };
    fetchBids();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">My Winning Bids</Typography>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Grid container spacing={3}>
        {bids.length === 0 ? (
          <Typography>No winning bids yet.</Typography>
        ) : (
          bids.map((bid) => (
            <Grid item xs={12} md={6} lg={4} key={bid._id}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">{bid.auctionTitle}</Typography>
                  <Typography variant="subtitle2">Bid Amount: ${bid.amount}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Auction ends: {new Date(bid.endDate).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default MyBids;
