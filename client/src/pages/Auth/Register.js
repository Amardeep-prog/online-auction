// src/pages/Auth/Register.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Avatar,
  MenuItem,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'buyer', // ✅ Changed from 'user' to 'buyer'
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/v1/auth/register', formData);
      login(res.data); // store user in context

      // ✅ Redirect based on role
      const role = res.data.user.role;
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'seller') {
        navigate('/seller/dashboard');
      } else if (role === 'buyer') {
        navigate('/buyer');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={6} sx={{ padding: 4, mt: 8, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ bgcolor: 'secondary.main', mb: 2 }}>
            <PersonAddIcon />
          </Avatar>
          <Typography variant="h5" component="h1" gutterBottom>
            Register
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              label="Username"
              name="username"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Password"
              name="password"
              fullWidth
              margin="normal"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <TextField
              select
              label="Role"
              name="role"
              fullWidth
              margin="normal"
              value={formData.role}
              onChange={handleChange}
            >
              <MenuItem value="buyer">Buyer</MenuItem>
              <MenuItem value="seller">Seller</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 2, py: 1.2, fontWeight: 'bold' }}
            >
              Register
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
