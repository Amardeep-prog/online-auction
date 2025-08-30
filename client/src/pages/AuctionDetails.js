// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import axios from 'axios';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminDashboard from './pages/Admin/Dashboard';
import SellerDashboard from './pages/Seller/Dashboard';
import BuyerDashboard from './pages/Buyer/Dashboard';
import AuctionDetails from './pages/AuctionDetails';
import Auctions from './pages/Auctions';

// Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Load token into Axios headers if it exists
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auctions" element={<Auctions />} />

            {/* 🔐 Protected Routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/seller/dashboard"
              element={
                <PrivateRoute role="seller">
                  <SellerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/buyer"
              element={
                <PrivateRoute role="buyer">
                  <BuyerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/auctions/:id"
              element={
                <PrivateRoute role="buyer">
                  <AuctionDetails />
                </PrivateRoute>
              }
            />
          </Routes>

          {/* 🔔 Global Toast Notification Container */}
          <ToastContainer position="top-right" autoClose={3000} />
        </>
      </AuthProvider>
    </Router>
  );
}

export default App;
