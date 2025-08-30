// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/auth/login', { email, password });
      console.log('Login Response:', res.data);

      if (res.data && res.data.user && res.data.token) {
        // ✅ Fixed: pass full login response to AuthContext
        login(res.data);

        toast.success('✅ Login successful');

        // Clear form
        setEmail('');
        setPassword('');

        // Redirect based on role
        const role = res.data.user.role;
        if (role === 'admin') navigate('/admin/users');
        else if (role === 'seller') navigate('/seller/dashboard');
        else navigate('/buyer');
      } else {
        toast.error('⚠️ Unexpected login response from server.');
      }
    } catch (err) {
      console.error('Login Error:', err.response?.data || err.message || err);
      const message =
        err.response?.data?.message || '🚫 Login failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login to Your Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
