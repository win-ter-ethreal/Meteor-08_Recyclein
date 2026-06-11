import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage/LandingPage';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard';
import Reservation from '../pages/Reservation/Reservation';
import Catalog from '../pages/WasteCatalog/WasteCatalog';
import Rewards from '../pages/Reward/Reward';
import Profile from '../pages/Profile/Profile';

const AppRoutes = () => (
  <div className="min-h-screen bg-white font-sans">
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/reservasi" element={<Reservation />} />
      <Route path="/katalog" element={<Catalog />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  </div>
);

export default AppRoutes;
