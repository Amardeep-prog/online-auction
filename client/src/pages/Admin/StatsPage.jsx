// src/pages/Admin/StatsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { Box, Typography, CircularProgress, Grid, Paper } from '@mui/material';

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/admin/stats');
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Platform Statistics
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {Object.entries(stats).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h6">{key.replace(/([A-Z])/g, ' $1')}</Typography>
                <Typography variant="h4">{value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default StatsPage;
