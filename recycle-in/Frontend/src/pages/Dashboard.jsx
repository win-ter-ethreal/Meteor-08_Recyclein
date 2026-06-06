import React from 'react'; // Cukup 1 import React
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Leaf, TreePine, Calendar, Gift } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return <div className="p-8 text-center">Silakan login terlebih dahulu.</div>;

  return (
    <div className="pb-20 max-w-md mx-auto bg-white min-h-screen">
      {/* Header Profile & Poin */}
      <div className="bg-primary text-white p-6 rounded-b-3xl shadow-lg">
        <h2 className="text-xl font-bold">Halo, {currentUser.name} 👋</h2>
        <p className="opacity-90 text-sm mt-1">Luar biasa! Bumi berterima kasih.</p>
        
        <div className="bg-white/20 mt-4 p-4 rounded-xl flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90">Poin Recycle-In</p>
            <h3 className="text-3xl font-bold text-accent">{currentUser.points.toLocaleString()}</h3>
          </div>
          <button onClick={() => navigate('/rewards')} className="bg-accent text-primary font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition">
            Tukar Poin
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="px-6 -mt-4">
        <div className="bg-white p-4 shadow-md rounded-xl flex justify-around border border-gray-100">
          <div className="text-center">
            <Leaf className="mx-auto text-primary mb-1" />
            <h4 className="font-bold text-lg">45.2kg</h4>
            <p className="text-xs text-gray-500">Sampah Daur</p>
          </div>
          <div className="text-center border-l border-r px-4">
            <TreePine className="mx-auto text-primary mb-1" />
            <h4 className="font-bold text-lg">12</h4>
            <p className="text-xs text-gray-500">Pohon Diselamatkan</p>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-4 p-6 mt-2">
        <button onClick={() => navigate('/reservasi')} className="bg-bg p-6 rounded-2xl flex flex-col items-center justify-center hover:shadow-lg transition border border-primary/10">
          <Calendar className="text-primary w-10 h-10 mb-2" />
          <span className="font-semibold text-primary">Jemput Sampah</span>
        </button>
        <button onClick={() => navigate('/katalog')} className="bg-bg p-6 rounded-2xl flex flex-col items-center justify-center hover:shadow-lg transition border border-primary/10">
          <Leaf className="text-primary w-10 h-10 mb-2" />
          <span className="font-semibold text-primary">Katalog Sampah</span>
        </button>
        <button onClick={() => navigate('/rewards')} className="bg-bg p-6 rounded-2xl flex flex-col items-center justify-center hover:shadow-lg transition border border-primary/10">
          <Gift className="text-primary w-10 h-10 mb-2" />
          <span className="font-semibold text-primary">Reward</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;