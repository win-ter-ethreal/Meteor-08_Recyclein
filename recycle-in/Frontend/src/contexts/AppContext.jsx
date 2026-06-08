import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();
const API_URL = 'http://localhost:5000/api';

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // ================= AUTH =================
  const login = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/login`, data);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(user);
      return { success: true, role: user.role };
    } catch (error) {
      return { success: false, msg: error.response?.data?.error || 'Gagal login' };
    }
  };

  const register = async (data) => {
    try {
      await axios.post(`${API_URL}/register`, data);
      return { success: true };
    } catch (error) {
      return { success: false, msg: error.response?.data?.error || 'Gagal register' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  // ================= USER FEATURES =================
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/kategori`);
      setCategories(response.data);
    } catch (error) {
      console.error('Gagal mengambil kategori sampah');
    }
  };

  const fetchRewards = async () => {
    try {
      const response = await axios.get(`${API_URL}/rewards`);
      setRewards(response.data);
    } catch (error) {
      console.error('Gagal mengambil rewards');
    }
  };

  const redeemReward = async (id_reward, poinDibutuhkan) => {
    try {
      // Mengirim { id_reward } sesuai yang diminta server.js
      await axios.post(`${API_URL}/rewards/redeem`, { id_reward });
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
      // Menggunakan /reservasi sesuai server.js
      await axios.post(`${API_URL}/reservasi`, data);
      return { success: true };
    } catch (error) {
      return { success: false, msg: error.response?.data?.error || 'Gagal membuat reservasi' };
    }
  };

  // ================= ADMIN FEATURES =================
  const fetchAdminStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats`);
      setAdminStats(response.data);
    } catch (error) {
      console.error('Gagal mengambil statistik admin');
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`);
      setAdminUsers(response.data);
    } catch (error) {
      console.error('Gagal mengambil data user');
    }
  };

  const fetchAdminReservations = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/reservasi`);
      setAdminReservations(response.data);
    } catch (error) {
      console.error('Gagal mengambil data reservasi');
    }
  };

  const updateReservationStatus = async (id_reservasi, status_penjemputan) => {
    try {
      await axios.put(`${API_URL}/admin/reservasi/${id_reservasi}`, { status_penjemputan });
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
      
      adminStats,
      adminUsers,
      adminReservations,
      fetchAdminStats,
      fetchAdminUsers,
      fetchAdminReservations,
      updateReservationStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);