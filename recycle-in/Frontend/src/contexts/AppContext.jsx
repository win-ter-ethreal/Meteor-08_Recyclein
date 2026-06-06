import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();
const API_URL = 'http://localhost:5000/api'; // URL Backend kita

export const AppProvider = ({ children }) => {
  // Ambil data user dari localStorage saat pertama kali load agar tidak logout saat refresh
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [rewards, setRewards] = useState([]);
  const [reservations, setReservations] = useState([]);

  // Set header Authorization axios saat pertama kali load jika ada token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Fungsi Login (Diubah menerima satu objek data)
  const login = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/login`, data);
      const { token, user } = response.data;
      
      // Simpan token dan user ke localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set default header axios untuk request ke depannya
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(user);
      return { success: true, role: user.role };
    } catch (error) {
      return { success: false, msg: error.response?.data?.error || 'Gagal login' };
    }
  };

  // Fungsi Register (Diubah menerima satu objek data)
  const register = async (data) => {
    try {
      await axios.post(`${API_URL}/register`, data);
      return { success: true };
    } catch (error) {
      return { success: false, msg: error.response?.data?.error || 'Gagal register' };
    }
  };

  // Fungsi Logout (Ditambahkan agar bisa logout)
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  // Fungsi Ambil Rewards
  const fetchRewards = async () => {
    try {
      const response = await axios.get(`${API_URL}/rewards`);
      setRewards(response.data);
    } catch (error) {
      console.error('Gagal mengambil rewards');
    }
  };

  // Fungsi Redeem Reward
  const redeemReward = async (rewardId) => {
    try {
      const response = await axios.post(`${API_URL}/rewards/redeem`, { rewardId });
      alert('Berhasil Redeem!');
      
      // Update points user di state & localStorage jika ada response user terbaru
      if (response.data.updatedUser) {
        const updatedUser = response.data.updatedUser;
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      fetchRewards(); 
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal redeem');
    }
  };

  // Fungsi Reservasi
  const addReservation = async (data) => {
    try {
      await axios.post(`${API_URL}/reservations`, data);
      alert('Reservasi berhasil dikonfirmasi!');
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal membuat reservasi');
    }
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      login, 
      register, 
      logout, // Tambahkan logout ke value
      rewards, 
      fetchRewards, 
      redeemReward, 
      addReservation 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);