import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-primary text-white p-6 lg:p-8 rounded-b-3xl lg:rounded-2xl shadow-lg">
      <h2 className="text-xl lg:text-2xl font-bold">Halo, {user.name} 👋</h2>
      <p className="opacity-90 text-sm mt-1">Luar biasa! Bumi berterima kasih.</p>

      <div className="lg:hidden bg-white/20 mt-4 p-4 rounded-xl flex justify-between items-center">
        <div>
          <p className="text-sm opacity-90">Poin Recycle-In</p>
          <h3 className="text-3xl font-bold text-accent">{user.points.toLocaleString()}</h3>
        </div>
        <button onClick={() => navigate('/rewards')} className="bg-accent text-primary font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition">
          Tukar Poin
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
