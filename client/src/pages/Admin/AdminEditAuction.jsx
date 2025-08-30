import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function AdminEditAuction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    endDate: '',
    image: null
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await axios.get(`/api/v1/admin/auctions/${id}`);
        const auction = res.data.data;
        setFormData({
          title: auction.title,
          description: auction.description,
          startingPrice: auction.startingPrice,
          endDate: auction.endDate.slice(0, 16),
          image: null
        });
      } catch (error) {
        toast.error('Failed to fetch auction data');
      }
    };
    fetchAuction();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('startingPrice', formData.startingPrice);
      form.append('endDate', formData.endDate);
      if (formData.image) {
        form.append('image', formData.image);
      }

      await axios.put(`/api/v1/admin/auctions/${id}`, form);
      toast.success('Auction updated successfully');
      navigate('/admin/auctions');
    } catch (err) {
      toast.error('Error updating auction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Edit Auction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Auction Title"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Auction Description"
          className="w-full px-4 py-2 border rounded"
          required
        ></textarea>
        <input
          type="number"
          name="startingPrice"
          value={formData.startingPrice}
          onChange={handleChange}
          placeholder="Starting Price"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="datetime-local"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Updating...' : 'Update Auction'}
        </button>
      </form>
    </div>
  );
}

export default AdminEditAuction;
