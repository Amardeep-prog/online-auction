import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios'; // ✅ relative path
import { Card, CardContent } from '../../components/ui/card'; // ✅
import { Button } from '../../components/ui/button'; // ✅
import { Loader } from '../../components/Loader';
import toast from 'react-hot-toast'; // ✅ make sure you ran: npm install react-hot-toast

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockUser = async (id, isBlocked) => {
    try {
      await axios.put(`/admin/users/${id}/${isBlocked ? "unblock" : "block"}`);
      toast.success(`User ${isBlocked ? "unblocked" : "blocked"} successfully`);
      fetchUsers(); // refresh
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user._id}>
            <CardContent className="p-4">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Status:</strong> {user.isBlocked ? "Blocked" : "Active"}</p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={() => toggleBlockUser(user._id, user.isBlocked)}
              >
                {user.isBlocked ? "Unblock" : "Block"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
