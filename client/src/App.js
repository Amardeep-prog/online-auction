import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import axios from 'axios';
import './App.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import AdminDashboard from './pages/Admin/Dashboard';
import AdminAuctions from './pages/Admin/AdminAuctions';
import AdminEditAuction from './pages/Admin/AdminEditAuction';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminStats from './pages/Admin/AdminStats';

import SellerDashboard from './pages/Seller/Dashboard';
import BuyerDashboard from './pages/Buyer/Dashboard';
import PastAuctions from './pages/Buyer/PastAuctions';
import Auctions from './pages/Auctions';

// Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Set auth token globally if present
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

            {/* 🔐 Admin Routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/stats"
              element={
                <PrivateRoute role="admin">
                  <AdminStats />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/auctions"
              element={
                <PrivateRoute role="admin">
                  <AdminAuctions />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/auctions/:id/edit"
              element={
                <PrivateRoute role="admin">
                  <AdminEditAuction />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute role="admin">
                  <AdminUsers />
                </PrivateRoute>
              }
            />

            {/* 🔐 Seller Routes */}
            <Route
              path="/seller/dashboard"
              element={
                <PrivateRoute role="seller">
                  <SellerDashboard />
                </PrivateRoute>
              }
            />

            {/* 🔐 Buyer Routes */}
            <Route
              path="/buyer"
              element={
                <PrivateRoute role="buyer">
                  <BuyerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/buyer/past-auctions"
              element={
                <PrivateRoute role="buyer">
                  <PastAuctions />
                </PrivateRoute>
              }
            />
          </Routes>

          <ToastContainer position="top-right" autoClose={3000} />
        </>
      </AuthProvider>
    </Router>
  );
}

export default App;
