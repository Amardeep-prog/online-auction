import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
} from '@mui/material';
import { toast } from 'react-toastify';

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) return;

    try {
      await axios.delete(`/admin/users/${id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
      <Paper sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default UsersPage;
