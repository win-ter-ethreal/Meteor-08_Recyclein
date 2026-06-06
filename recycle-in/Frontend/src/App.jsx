import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Reservation from './pages/Reservation';
import Catalog from './pages/Catalog';
import Rewards from './pages/Rewards';

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-bg font-sans">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/reservasi" element={<Reservation />} />
            <Route path="/katalog" element={<Catalog />} />
            <Route path="/rewards" element={<Rewards />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;