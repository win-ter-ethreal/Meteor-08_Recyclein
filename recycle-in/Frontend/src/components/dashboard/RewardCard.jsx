import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, ArrowRight } from 'lucide-react';

const RewardCard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="text-accent w-5 h-5" />
        <h3 className="font-bold text-gray-800">Reward Populer</h3>
      </div>
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100">
        <p className="text-sm text-gray-600">Tukarkan poin Anda dengan berbagai reward menarik!</p>
        <button
          onClick={() => navigate('/rewards')}
          className="mt-3 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition flex items-center gap-2"
        >
          Lihat Reward <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default RewardCard;
