import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';
import { loginUser, registerUser } from '../services/authService';
import { getCategories, addReservation as addReservationApi } from '../services/wasteService';
import { getRewards, redeemReward as redeemRewardApi } from '../services/rewardService';
import { updateProfile as updateProfileApi, changePassword as changePasswordApi } from '../services/userService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ================= STATE =================
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [rewards, setRewards] = useState([]);
  const [categories, setCategories] = useState([]);

  const [adminStats, setAdminStats] = useState({ totalUsers: 0, totalMitra: 0, totalReservasi: 0 });
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminReservations, setAdminReservations] = useState([]);
  
  const [claimHistory, setClaimHistory] = useState([]); // Untuk User
  const [adminClaims, setAdminClaims] = useState([]);   // BARU: Untuk Admin

  // ================= AUTH =================
  const login = async (data) => {
    try {
      const result = await loginUser(data);
      const { token, user } = result;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setCurrentUser(user);
      return { success: true, role: user.role };
    } catch (error) {
      return { success: false, msg: error.response?.data?.error || 'Gagal login' };
    }
  };

  const register = async (data) => {
    try {
      await registerUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, msg: error.response?.data?.error || 'Gagal register' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  // ================= USER FEATURES =================
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Gagal mengambil kategori sampah');
    }
  };

  const fetchRewards = async () => {
    try {
      const data = await getRewards();
      setRewards(data);
    } catch (error) {
      console.error('Gagal mengambil rewards');
    }
  };

  const redeemReward = async (id_reward) => {
    try {
      await redeemRewardApi(id_reward);
      await fetchUserProfile(); 
      fetchRewards();
      return { success: true, msg: 'Berhasil Redeem!' };
    } catch (error) {
      return { success: false, msg: error.response?.data?.error || 'Gagal redeem' };
    }
  };

  const addReservation = async (data) => {
    try {
      await addReservationApi(data);
      return { success: true };
    } catch (error) {
      return { success: false, msg: error.response?.data?.error || 'Gagal membuat reservasi' };
    }
  };

  // ================= PROFILE =================
  const updateProfile = async (data) => {
    try {
      await updateProfileApi(data);
      await fetchUserProfile(); 
      return { success: true, msg: 'Profil berhasil diupdate' };
    } catch (error) {
      return { success: false, msg: error.response?.data?.error || 'Gagal update profil' };
    }
  };

  const changePassword = async (data) => {
    try {
      await changePasswordApi(data);
      return { success: true, msg: 'Password berhasil diganti' };
    } catch (error) {
      return { success: false, msg: error.response?.data?.error || 'Gagal ganti password' };
    }
  };

  // ================= ADMIN FEATURES =================
  const fetchAdminStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setAdminStats(response.data);
    } catch (error) {
      console.error('Gagal mengambil statistik admin');
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setAdminUsers(response.data);
    } catch (error) {
      console.error('Gagal mengambil data user');
    }
  };

  const fetchAdminReservations = async () => {
    try {
      const response = await api.get('/admin/reservasi');
      setAdminReservations(response.data);
    } catch (error) {
      console.error('Gagal mengambil data reservasi');
    }
  };

  const updateReservationStatus = async (id_reservasi, status_penjemputan) => {
    try {
      await api.put(`/admin/reservasi/${id_reservasi}`, { status_penjemputan });
      fetchAdminReservations();
      if (status_penjemputan === 'Selesai') {
        fetchAdminStats();
      }
      return { success: true, msg: `Reservasi berhasil diupdate menjadi "${status_penjemputan}"!` };
    } catch (error) {
      return { success: false, msg: error.response?.data?.error || 'Gagal update status reservasi' };
    }
  };

  const adminResetPassword = async (userId) => {
    try {
      const response = await api.put(`/admin/users/${userId}/reset-password`);
      return { success: true, msg: response.data.message };
    } catch (error) {
      return { success: false, msg: error.response?.data?.error || 'Gagal reset password' };
    }
  };

  const adminToggleUserStatus = async (userId) => {
    try {
      const response = await api.put(`/admin/users/${userId}/toggle-status`);
      fetchAdminUsers();
      return { success: true, is_active: response.data.is_active, msg: response.data.message };
    } catch (error) {
      return { success: false, msg: error.response?.data?.error || 'Gagal mengubah status user' };
    }
  };

  const fetchReservationDetail = async (reservationId) => {
    try {
      // Sesuaikan dengan endpoint detail di server.js Anda
      const response = await api.get(`/admin/reservasi/${reservationId}`);
      return response.data;
    } catch (error) {
      console.error('Gagal mengambil detail reservasi');
      return null;
    }
  };

  // ================= GACHA & CLAIM FEATURES (USER) =================
  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/profile');
      setCurrentUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Gagal memuat profil terbaru');
    }
  };

  const pullGacha = async (rewardName, rarity, cost) => {
    try {
      await api.post('/gacha/pull', { reward_name: rewardName, rarity, cost });
      await Promise.all([fetchUserProfile(), fetchClaimHistory()]);
      return { success: true };
    } catch (error) {
      return { success: false, msg: error.response?.data?.error || 'Gacha gagal' };
    }
  };

  const fetchClaimHistory = async () => {
    try {
      const response = await api.get('/gacha/history');
      setClaimHistory(response.data);
    } catch (error) { 
      console.error('Gagal ambil riwayat klaim user'); 
    }
  };

  const claimReward = async (id_claim) => {
    try {
      await api.put(`/gacha/claim/${id_claim}`);
      await fetchClaimHistory(); 
      return { success: true, msg: 'Hadiah berhasil diklaim! Tunggu Admin memproses.' };
    } catch (error) { 
      return { success: false, msg: 'Gagal mengklaim hadiah' };
    }
  };

  // ================= ADMIN CLAIM FEATURES (BARU) =================
  
  // Admin: Mengambil semua data klaim dari semua user
  const fetchAdminClaims = async () => {
    try {
      const response = await api.get('/admin/claims');
      setAdminClaims(response.data);
    } catch (error) {
      console.error('Gagal mengambil data klaim admin');
    }
  };

  // Admin: Menyetujui pemberian hadiah
  const approveClaim = async (id_claim) => {
    try {
      const response = await api.put(`/admin/claims/${id_claim}/approve`);
      fetchAdminClaims(); // Refresh tabel setelah approve
      return { success: true, msg: response.data.message };
    } catch (error) {
      return { success: false, msg: error.response?.data?.error || 'Gagal menyetujui klaim' };
    }
  };

  // ================= PROVIDER =================
  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser, login, register, logout,
      rewards, categories, fetchCategories, fetchRewards, redeemReward, addReservation,
      updateProfile, changePassword,
      adminStats, adminUsers, adminReservations, 
      fetchAdminStats, fetchAdminUsers, fetchAdminReservations, updateReservationStatus,
      adminResetPassword, adminToggleUserStatus, fetchReservationDetail,
      fetchUserProfile,
      claimHistory, pullGacha, fetchClaimHistory, claimReward, // Untuk User
      adminClaims, fetchAdminClaims, approveClaim // BARU: Untuk Admin
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);