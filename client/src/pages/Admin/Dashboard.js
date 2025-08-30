import React from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom color="primary">
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Welcome, <strong>{user?.username || 'Admin'}</strong>
        </Typography>

        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6">Manage Users</Typography>
                <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/admin/users')}>
                  View Users
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6">Manage Auctions</Typography>
                <Button fullWidth variant="contained" color="secondary" sx={{ mt: 2 }} onClick={() => navigate('/admin/auctions')}>
                  View Auctions
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6">Site Statistics</Typography>
                <Button fullWidth variant="outlined" color="info" sx={{ mt: 2 }} onClick={() => navigate('/admin/stats')}>
                  View Stats
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box textAlign="right" mt={5}>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
