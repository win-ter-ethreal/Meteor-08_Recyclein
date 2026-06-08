import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import LandingPage from './pages/LandingPage'; // Import Landing Page
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
        <div className="min-h-screen bg-white font-sans">
          <Routes>
            {/* Root sekarang menjadi Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Login dipindah ke /login */}
            <Route path="/login" element={<Login />} />
            
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