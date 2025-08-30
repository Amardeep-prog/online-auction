// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 Logged in user:", user);
  }, [user]);

  const handleDashboard = () => {
    if (user?.role === 'admin') navigate('/admin');
    else if (user?.role === 'seller') navigate('/seller/dashboard');
    else if (user?.role === 'buyer') navigate('/buyer');
  };

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={10} p={4} boxShadow={3} borderRadius={3}>
        <Typography variant="h3" gutterBottom color="primary">
          Online Auction Platform
        </Typography>

        {user ? (
          <>
            <Typography variant="h5" mt={3}>
              Welcome, <strong>{user.username || 'Guest'}</strong>
            </Typography>
            <Typography variant="subtitle1" mb={3}>
              You are logged in as <strong>{user.role || 'Unknown'}</strong>
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleDashboard}
            >
              Go to Dashboard
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" mb={4}>
              Join our platform to buy and sell through auctions!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ mr: 2 }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Home;
