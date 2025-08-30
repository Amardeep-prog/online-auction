import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
} from '@mui/material';

const StatCard = ({ label, value }) => (
  <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
    <Typography variant="h6" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h4">{value}</Typography>
  </Paper>
);

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAuctions: 0,
    totalBids: 0,
    activeAuctions: 0,
    expiredAuctions: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard Stats
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard label="Total Users" value={stats.totalUsers} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard label="Total Auctions" value={stats.totalAuctions} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard label="Total Bids" value={stats.totalBids} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard label="Active Auctions" value={stats.activeAuctions} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard label="Expired Auctions" value={stats.expiredAuctions} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminStats;
