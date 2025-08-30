// src/pages/Buyer/PastAuctions.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PastAuctions = () => {
  const [expiredAuctions, setExpiredAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpiredAuctions = async () => {
      try {
        const res = await axios.get('/api/v1/auctions');
        const now = new Date();
        const filtered = res.data.data.filter(
          (auction) => new Date(auction.endDate) < now
        );
        setExpiredAuctions(filtered);
      } catch (error) {
        console.error('Failed to fetch past auctions:', error);
      }
    };
    fetchExpiredAuctions();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Past Auctions
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/buyer-dashboard')}>
          ⬅ Back to Dashboard
        </Button>
      </Box>
      {expiredAuctions.length === 0 ? (
        <Typography>No expired auctions to show.</Typography>
      ) : (
        <Grid container spacing={3}>
          {expiredAuctions.map((auction) => (
            <Grid item xs={12} sm={6} md={4} key={auction._id}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">{auction.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {auction.description.substring(0, 100)}...
                  </Typography>
                  <Typography variant="subtitle2">
                    <strong>Final Price:</strong> ${auction.currentPrice}
                  </Typography>
                  <Typography variant="subtitle2">
                    <strong>Ended on:</strong> {new Date(auction.endDate).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default PastAuctions;
