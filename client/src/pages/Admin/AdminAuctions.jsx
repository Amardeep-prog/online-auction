// src/pages/Admin/AdminAuctions.jsx

import React, { useEffect, useState, useCallback } from 'react';
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
} from '@mui/material';

const AdminAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);

  const fetchAuction = useCallback(async () => {
    try {
      const res = await axios.get('/auctions');
      setAuctions(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []); // ✅ no external dependencies

  useEffect(() => {
    fetchAuction();
  }, [fetchAuction]); // ✅ no warning now

  const handleEditClick = (auction) => {
    setSelectedAuction(auction);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedAuction(null);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`/auctions/${selectedAuction._id}`, selectedAuction);
      fetchAuction();
      handleCloseEdit();
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedAuction((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Auction Management
      </Typography>
      <Grid container spacing={2}>
        {auctions.map((auction) => (
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
                <Typography variant="caption">
                  Start: {new Date(auction.startDate).toLocaleString()}
                </Typography>
                <br />
                <Typography variant="caption">
                  End: {new Date(auction.endDate).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleEditClick(auction)}>
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Edit Auction</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            value={selectedAuction?.title || ''}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            value={selectedAuction?.description || ''}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="startDate"
            label="Start Date"
            type="datetime-local"
            fullWidth
            value={
              selectedAuction?.startDate
                ? new Date(selectedAuction.startDate).toISOString().slice(0, 16)
                : ''
            }
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="endDate"
            label="End Date"
            type="datetime-local"
            fullWidth
            value={
              selectedAuction?.endDate
                ? new Date(selectedAuction.endDate).toISOString().slice(0, 16)
                : ''
            }
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminAuctions;
