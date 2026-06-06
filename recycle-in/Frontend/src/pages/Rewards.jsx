import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ArrowLeft, Gift } from 'lucide-react';

const Rewards = () => {
  const { currentUser, rewards, fetchRewards, redeemReward } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRewards();
  }, []);

  if (!currentUser) {
    return <div className="p-8 text-center">Silakan login terlebih dahulu.</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="p-4 flex items-center border-b">
        <button onClick={() => navigate('/dashboard')} className="text-primary"><ArrowLeft /></button>
        <h2 className="flex-1 text-center font-bold text-lg">Tukar Poin</h2>
        {/* Tambahkan ?. sebelum toLocaleString */}
        <div className="bg-accent text-primary font-bold px-3 py-1 rounded-full text-sm">
          {currentUser.points?.toLocaleString() || 0} Poin
        </div>
      </div>

      <div className="p-6 space-y-4">
        {rewards.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">Belum ada reward tersedia.</p>
        ) : (
          rewards.map(reward => (
            <div key={reward.id} className="border rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="bg-bg p-3 rounded-lg">
                <Gift className="text-primary w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">{reward.title || reward.name || 'Reward'}</h3>
                {/* Tambahkan ?. sebelum toLocaleString, dan fallback || 0 */}
                <p className="text-primary font-bold mt-1">{reward.points?.toLocaleString() || reward.point?.toLocaleString() || 0} Poin</p>
                <p className="text-xs text-gray-400">Sisa stok: {reward.stock || 0}</p>
              </div>
              <button 
                onClick={() => redeemReward(reward.id)}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-secondary transition"
              >
                Redeem
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Rewards;