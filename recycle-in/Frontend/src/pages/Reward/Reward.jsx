import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Coins, AlertCircle, Truck, Sparkles, Gift, Box, Star, X, CheckCircle, Clock, Package } from 'lucide-react';

// Helper function untuk delay saat animasi
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 🎲 LOOT POOL GACHA (Probabilitas Dinormalisasi hingga 100%)
const LOOT_POOL = [
  { id: 1, name: "iPhone 12 64GB", emoji: "📱", probability: 0.01, rarity: "Legendaris" },   // 1%
  { id: 2, name: "Saldo Dana 100k", emoji: "💰", probability: 0.09, rarity: "Epik" },       // 9%
  { id: 3, name: "Saldo Dana 10k", emoji: "💵", probability: 0.30, rarity: "Langka" },       // 30%
  { id: 4, name: "Saldo Dana 5k", emoji: "💸", probability: 0.50, rarity: "Normal" },        // 50%
  { id: 5, name: "Voucher Mitra Potongan 5%", emoji: "🎟️", probability: 0.10, rarity: "Normal" } // 10%
];

// Fungsi Randomizer berdasarkan Bobot Probabilitas
const getRandomLoot = () => {
  const rand = Math.random();
  let cumulative = 0;
  for (const item of LOOT_POOL) {
    cumulative += item.probability;
    if (rand <= cumulative) return item;
  }
  return LOOT_POOL[LOOT_POOL.length - 1]; // Fallback
};

const Reward = () => {
  const navigate = useNavigate();
  const { currentUser, pullGacha, fetchUserProfile, fetchClaimHistory, claimHistory, claimReward } = useApp();

  // State Gacha Animation
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedReward, setRevealedReward] = useState(null);
  
  // State Toast Notification
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });

  const GACHA_COST = 500; // Biaya per tarik

  useEffect(() => {
    if (fetchUserProfile) fetchUserProfile();
    if (fetchClaimHistory) fetchClaimHistory();
  }, []);

  // Fungsi Toast
  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 4000);
  };

  // Fix White Screen: Jangan render blank, tapi redirect
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Fungsi Gacha
  const handleGachaPull = async () => {
    if (isAnimating) return; // Cegah spam klik

    if (currentUser.points < GACHA_COST) {
      showToast('Poin kamu kurang! Butuh 500 Poin untuk 1x tarik.', 'error');
      return;
    }

    // 1. Animasi Getar
    setIsAnimating('shaking');
    setRevealedReward(null);

    // 2. Acak Hadiah
    const wonReward = getRandomLoot();

    // Tunggu animasi
    await sleep(1500);
    setIsAnimating('revealing');
    await sleep(500);

    // 3. Tunjukkan hadiah & Potong poin di Backend
    const result = await pullGacha(wonReward.name, wonReward.rarity, GACHA_COST);

    if (result.success) {
      setRevealedReward(wonReward);
      showToast(`Selamat! Kamu mendapatkan ${wonReward.name}!`, 'success');
    } else {
      showToast(result.msg || 'Gacha gagal, coba lagi.', 'error');
    }
    setIsAnimating(false);
  };

  // Variabel animasi Framer Motion
  const boxVariants = {
    idle: { 
      y: [0, -15, 0], rotate: [0, -3, 3, 0],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
    },
    shaking: { 
      x: [0, -20, 20, -20, 20, 0], rotate: [0, -15, 15, 0],
      transition: { duration: 1.5, ease: "easeInOut" }
    },
    revealing: { 
      scale: [1, 1.4, 0], opacity: [1, 1, 0],
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  };

  const getRarityColor = (rarity) => {
    if (rarity === 'Legendaris') return 'text-yellow-500';
    if (rarity === 'Epik') return 'text-purple-500';
    if (rarity === 'Langka') return 'text-blue-500';
    return 'text-gray-600';
  };

  const getRarityBg = (rarity) => {
    if (rarity === 'Legendaris') return 'bg-yellow-50 border-yellow-200';
    if (rarity === 'Epik') return 'bg-purple-50 border-purple-200';
    if (rarity === 'Langka') return 'bg-blue-50 border-blue-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getStatusBadge = (status) => {
    if (status === 'Menunggu Klaim') return 'bg-yellow-100 text-yellow-700';
    if (status === 'Diproses Admin') return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50 pb-16 relative">
      
      {/* ===== CUSTOM TOAST NOTIFICATION ===== */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: -100, opacity: 0 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
              toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
            <span className="font-bold">{toast.msg}</span>
            <button onClick={() => setToast({ ...toast, show: false })} className="ml-2 opacity-70 hover:opacity-100"><X size={18} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="bg-white border-b shadow-sm relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900 transition">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Mystery Box & Reward</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* 1. Card Saldo Poin Utama */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-3xl"></div>
          <div className="relative z-10 flex items-center gap-5">
            <div className="bg-white/30 p-4 rounded-2xl backdrop-blur-sm">
              <Coins size={40} className="text-white" />
            </div>
            <div>
              <p className="text-yellow-100 text-sm font-medium">Saldo Poin Anda</p>
              <h2 className="text-5xl font-extrabold text-white tracking-tight">
                {currentUser.points?.toLocaleString() || 0}
              </h2>
            </div>
          </div>
          <div className="bg-white/20 px-5 py-3 rounded-xl text-white text-sm font-semibold flex items-center gap-2">
            <Sparkles size={16} /> 1x Pull = {GACHA_COST} Poin
          </div>
        </div>

        {/* 2. Cara Bermain */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" /> Bagaimana Cara Bermain Gacha?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div className="flex gap-3 items-start">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <p>Serahkan sampah ke petugas untuk mendapatkan <span className="font-bold">Poin</span>.</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <p>Klik <span className="font-bold">Buka Kotak Misteri</span> (Biaya 500 Poin).</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <p>Dapatkan hadiah acak & klaim hadiahmu di riwayat bawah!</p>
            </div>
          </div>
        </div>

        {/* 3. AREA GACHA MYSTERY BOX */}
        <div className="bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 rounded-3xl p-10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] border-4 border-purple-500/30">
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => <Star key={i} className="absolute text-white animate-pulse" style={{top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, width: `${Math.random()*20+5}px`}} />)}
          </div>

          <h2 className="text-white text-3xl font-extrabold mb-8 z-10 drop-shadow-lg text-center tracking-wider">✨ MYSTERY BOX ✨</h2>

          <div className="relative w-64 h-64 flex items-center justify-center mb-8 z-10">
            <AnimatePresence mode="wait">
              {!revealedReward ? (
                <motion.div
                  key="box"
                  variants={boxVariants}
                  animate={isAnimating || 'idle'}
                  className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-3xl shadow-[0_20px_50px_rgba(250,204,21,0.5)] border-4 border-yellow-200 flex items-center justify-center cursor-pointer select-none hover:brightness-110 transition-all"
                  onClick={handleGachaPull}
                >
                  <Box size={100} className="text-yellow-800 drop-shadow-md" />
                </motion.div>
              ) : (
                <motion.div
                  key="reward"
                  initial={{ scale: 0, rotate: -360, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", damping: 10, stiffness: 80 }}
                  className="bg-white w-full h-full rounded-3xl shadow-2xl flex flex-col items-center justify-center p-6 text-center border-4 border-yellow-400"
                >
                  <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                    <span className="text-6xl mb-4 block">{revealedReward.emoji}</span>
                    <h3 className={`text-2xl font-extrabold ${getRarityColor(revealedReward.rarity)}`}>{revealedReward.name}</h3>
                    <p className="text-gray-500 font-bold text-sm mt-2 uppercase tracking-widest">{revealedReward.rarity}</p>
                    <div className="flex items-center justify-center gap-1 mt-4 text-sm text-gray-400">
                      <Coins size={16} className="text-yellow-500" /> 
                      Terpotong {GACHA_COST} Poin
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!revealedReward ? (
            <button 
              onClick={handleGachaPull}
              disabled={isAnimating === 'shaking'}
              className="z-10 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-extrabold px-12 py-5 rounded-2xl text-2xl shadow-lg shadow-yellow-600/40 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3 border-b-8 border-yellow-500 hover:border-b-4"
            >
              <Sparkles size={28} /> BUKA!
            </button>
          ) : (
            <button 
              onClick={() => setRevealedReward(null)}
              className="z-10 bg-green-500 hover:bg-green-600 text-white font-extrabold px-12 py-5 rounded-2xl text-2xl shadow-lg active:scale-95 transition-all flex items-center gap-3 border-b-8 border-green-700 hover:border-b-4"
            >
              Buka Lagi 🎉
            </button>
          )}
        </div>

        {/* 4. Info Peringatan Gacha */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-orange-500 w-5 h-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-orange-800 font-medium">Sistem Gacha! Setiap tarik membutuhkan 500 Poin. Hadiah ditentukan secara acak (RNG) berdasarkan tingkat kelangkaan (Drop Rate). Poin akan langsung dipotong saat menekan tombol BUKA. Segera klaim hadiahmu di bawah!</p>
        </div>

        {/* 5. RIWAYAT HADIAH & KLAIM */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <Package className="w-6 h-6 text-purple-600" /> Riwayat Hadiah Saya
          </h3>
          
          {claimHistory.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border text-gray-400">
              <Gift size={40} className="mx-auto mb-3 opacity-50" />
              <p>Belum ada hadiah. Ayo buka Mystery Box!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {claimHistory.map(item => (
                <div key={item.id_claim} className={`rounded-2xl border p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${getRarityBg(item.rarity)}`}>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">
                      {LOOT_POOL.find(l => l.name === item.reward_name)?.emoji || '🎁'}
                    </div>
                    <div>
                      <h4 className={`font-bold text-gray-900 ${getRarityColor(item.rarity)}`}>{item.reward_name}</h4>
                      <p className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                    {item.status === 'Menunggu Klaim' && (
                      <button 
                        onClick={() => {
                          claimReward(item.id_claim);
                          showToast('Hadiah berhasil diklaim! Tunggu Admin memproses.', 'success');
                        }}
                        className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition active:scale-95 flex items-center gap-1"
                      >
                        <CheckCircle size={16}/> Klaim
                      </button>
                    )}
                    {item.status === 'Diproses Admin' && (
                      <span className="text-blue-500 text-sm flex items-center gap-1"><Clock size={14}/> Menunggu Admin</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. Daftar Drop Rate Loot Pool */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-5">📦 Daftar Hadiah & Drop Rate</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LOOT_POOL.map(item => (
              <div key={item.id} className="bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm">
                <div className="text-4xl">{item.emoji}</div>
                <div className="flex-1">
                  <h4 className={`font-bold text-gray-900 ${getRarityColor(item.rarity)}`}>{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getRarityBg(item.rarity)} ${getRarityColor(item.rarity)}`}>
                      {item.rarity}
                    </span>
                    <span className="text-xs text-gray-400 font-bold">{(item.probability * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reward;