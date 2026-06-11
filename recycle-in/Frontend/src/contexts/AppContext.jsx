import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';
import { loginUser, registerUser } from '../services/authService';
import { getCategories, addReservation as addReservationApi } from '../services/wasteService';
import { getRewards, redeemReward as redeemRewardApi } from '../services/rewardService';
import { updateProfile as updateProfileApi, changePassword as changePasswordApi } from '../services/userService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [rewards, setRewards] = useState([]);
  const [categories, setCategories] = useState([]);

  const [adminStats, setAdminStats] = useState({ totalUsers: 0, totalMitra: 0, totalReservasi: 0 });
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminReservations, setAdminReservations] = useState([]);

  // ================= AUTH =================
  const login = async (data) => {
    try {
      const result = await loginUser(data);
      const { token, user } = result;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

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

  const redeemReward = async (id_reward, poinDibutuhkan) => {
    try {
      await redeemRewardApi(id_reward);
      alert('Berhasil Redeem!');

      if (currentUser) {
        const updatedUser = { ...currentUser, points: currentUser.points - poinDibutuhkan };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      fetchRewards();
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal redeem');
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
      const result = await updateProfileApi(data);
      const updatedUser = { ...currentUser, ...data };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, msg: error.response?.data?.error || 'Gagal update profil' };
    }
  };

  const changePassword = async (data) => {
    try {
      await changePasswordApi(data);
      return { success: true };
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
      alert(`Reservasi berhasil diupdate menjadi "${status_penjemputan}"!`);

      fetchAdminReservations();

      if (status_penjemputan === 'Selesai') {
        fetchAdminStats();
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal update status reservasi');
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      login,
      register,
      logout,

      rewards,
      categories,
      fetchCategories,
      fetchRewards,
      redeemReward,
      addReservation,

      updateProfile,
      changePassword,

      adminStats,
      adminUsers,
      adminReservations,
      fetchAdminStats,
      fetchAdminUsers,
      fetchAdminReservations,
      updateReservationStatus,
      adminResetPassword: async (userId) => {
        try {
          const response = await api.put(`/admin/users/${userId}/reset-password`);
          alert(response.data.message);
          return { success: true };
        } catch (error) {
          alert(error.response?.data?.error || 'Gagal reset password');
          return { success: false };
        }
      },
      adminToggleUserStatus: async (userId) => {
        try {
          const response = await api.put(`/admin/users/${userId}/toggle-status`);
          alert(response.data.message);
          fetchAdminUsers();
          return { success: true, is_active: response.data.is_active };
        } catch (error) {
          alert(error.response?.data?.error || 'Gagal mengubah status user');
          return { success: false };
        }
      },
      fetchReservationDetail: async (reservationId) => {
        try {
          const response = await api.get(`/admin/reservasi/${reservationId}/detail`);
          return response.data;
        } catch (error) {
          console.error('Gagal mengambil detail reservasi');
          return null;
        }
      }
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
