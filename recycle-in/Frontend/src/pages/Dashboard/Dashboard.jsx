import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Calendar, Leaf, Gift, Clock, ArrowRight, User } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import QuickActionCard from '../../components/dashboard/QuickActionCard';
import RewardCard from '../../components/dashboard/RewardCard';
import DashboardLayout from '../../components/layout/DashboardLayout';

const Dashboard = () => {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return <div className="p-8 text-center">Silakan login terlebih dahulu.</div>;

  if (currentUser.role === 'admin') {
    navigate('/admin', { replace: true });
    return null;
  }

  return (
    <>
      <Navbar />
      <DashboardLayout>
        {/* ===== MOBILE LAYOUT (< 1024px) ===== */}
        <div className="lg:hidden">
          <DashboardHeader user={currentUser} />

          <div className="px-6 -mt-4">
            <StatsCard />
          </div>

          <div className="grid grid-cols-2 gap-4 p-6 mt-2">
            <QuickActionCard icon={<Calendar />} label="Jemput Sampah" onClick={() => navigate('/reservasi')} />
            <QuickActionCard icon={<Leaf />} label="Katalog Sampah" onClick={() => navigate('/katalog')} />
            <QuickActionCard icon={<Gift />} label="Reward" onClick={() => navigate('/rewards')} />
            <QuickActionCard icon={<User />} label="Profil Saya" onClick={() => navigate('/profile')} />
          </div>
        </div>

        {/* ===== DESKTOP LAYOUT (>= 1024px) ===== */}
        <div className="hidden lg:block p-6 lg:p-8">
          <div className="grid grid-cols-2 gap-8">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              <DashboardHeader user={currentUser} />

              <StatsCard />

              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="text-primary w-5 h-5" />
                  <h3 className="font-bold text-gray-800">Aktivitas Terbaru</h3>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className="text-gray-400 text-sm">Belum ada aktivitas penjemputan</p>
                </div>
                <button
                  onClick={() => navigate('/reservasi')}
                  className="mt-4 text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Jadwalkan Penjemputan <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Menu Cepat</h3>
                <div className="space-y-3">
                  <QuickActionCard icon={<Calendar />} label="Jemput Sampah" onClick={() => navigate('/reservasi')} variant="horizontal" />
                  <QuickActionCard icon={<Leaf />} label="Katalog Sampah" onClick={() => navigate('/katalog')} variant="horizontal" />
                  <QuickActionCard icon={<Gift />} label="Reward" onClick={() => navigate('/rewards')} variant="horizontal" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-green-700 text-white p-6 rounded-2xl shadow-lg">
                <p className="text-sm opacity-90">Poin Recycle-In</p>
                <h3 className="text-3xl font-bold text-accent mt-1">{currentUser.points.toLocaleString()}</h3>
                <p className="text-xs opacity-75 mt-1">Terus kumpulkan poin dan tukarkan dengan reward menarik!</p>
                <button
                  onClick={() => navigate('/rewards')}
                  className="bg-accent text-primary font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition mt-4 w-full"
                >
                  Tukar Poin
                </button>
              </div>

              <RewardCard />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
