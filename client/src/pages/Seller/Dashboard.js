import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import {
  Container, Typography, Box, Button, AppBar, Toolbar, IconButton,
  Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, CircularProgress
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SellerDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [newAuction, setNewAuction] = useState({
    title: '',
    description: '',
    startingPrice: '',
    endDate: '',
    category: '',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await axios.get('/auctions/user/me');
        setAuctions(res.data.data || []);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };
    fetchAuctions();
  }, []);

  const handleInputChange = (e) => {
    setNewAuction({ ...newAuction, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleCreateAuction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auctionData = {
        ...newAuction,
        startingPrice: Number(newAuction.startingPrice),
        category: newAuction.category.toLowerCase(), // 🟢 Enforce lowercase
      };
      const res = await axios.post('/auctions', auctionData);

      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append('images', img));
        await axios.put(`/auctions/${res.data.data._id}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      const updatedAuctions = await axios.get('/auctions/user/me');
      setAuctions(updatedAuctions.data.data || []);
      setNewAuction({ title: '', description: '', startingPrice: '', endDate: '', category: '' });
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      alert('Failed to create auction: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEndAuction = async (auctionId) => {
    try {
      await axios.put(`/api/seller/auctions/${auctionId}/end`);
      setAuctions((prev) =>
        prev.map((auc) => (auc._id === auctionId ? { ...auc, status: 'ended' } : auc))
      );
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Seller Dashboard</Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Typography variant="h4" mt={3} mb={3} align="center" fontWeight="bold" color="primary">
        Manage Your Auctions
      </Typography>

      <Paper elevation={4} sx={{ p: 4, mb: 6, borderRadius: 3, bgcolor: '#f9f9f9' }}>
        <Typography variant="h5" mb={3} fontWeight="medium">Create New Auction</Typography>
        <Box component="form" onSubmit={handleCreateAuction} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField label="Title" name="title" value={newAuction.title} onChange={handleInputChange} fullWidth required margin="normal" />
              <TextField label="Starting Price" name="startingPrice" value={newAuction.startingPrice} onChange={handleInputChange} type="number" fullWidth required margin="normal" inputProps={{ min: 0 }} />
              <TextField label="End Date" name="endDate" value={newAuction.endDate} onChange={handleInputChange} type="datetime-local" InputLabelProps={{ shrink: true }} fullWidth required margin="normal" />
              <TextField
                select
                label="Category"
                name="category"
                value={newAuction.category}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
                SelectProps={{ native: true }}
              >
                <option value="">Select a category</option>
                <option value="art">Art</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home</option>
                <option value="sports">Sports</option>
                <option value="collectibles">Collectibles</option>
                <option value="vehicles">Vehicles</option>
                <option value="other">Other</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Description" name="description" value={newAuction.description} onChange={handleInputChange} fullWidth required margin="normal" multiline rows={6} />
              <Button variant="contained" component="label" sx={{ mt: 2 }}>
                Upload Images
                <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
              </Button>
              <Box mt={2} display="flex" gap={2} flexWrap="wrap">
                {imagePreviews.map((src, i) => (
                  <Box key={i} sx={{ position: 'relative', width: 100, height: 100, borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
                    <img src={src} alt={`preview-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <IconButton size="small" onClick={() => removeImage(i)} sx={{ position: 'absolute', top: 0, right: 0, color: 'white', bgcolor: 'rgba(0,0,0,0.6)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 4, fontWeight: 'bold' }} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Auction'}
          </Button>
        </Box>
      </Paper>

      <Typography variant="h5" mb={2} fontWeight="medium">My Auctions</Typography>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Current Price</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>End Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auctions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No auctions created yet.</TableCell>
              </TableRow>
            ) : (
              auctions.map((auction) => (
                <TableRow key={auction._id} hover>
                  <TableCell>
                    <Button onClick={() => navigate(`/auctions/${auction._id}`)} color="primary">
                      {auction.title}
                    </Button>
                  </TableCell>
                  <TableCell>${auction.currentPrice || auction.startingPrice}</TableCell>
                  <TableCell>{new Date(auction.endDate).toLocaleString()}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{auction.status}</TableCell>
                  <TableCell>
                    {auction.status === 'active' && (
                      <Button variant="contained" color="secondary" onClick={() => handleEndAuction(auction._id)}>
                        End Auction
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SellerDashboard;
