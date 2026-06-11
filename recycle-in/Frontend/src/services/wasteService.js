import api from './api';

export const getCategories = async () => {
  const response = await api.get('/kategori');
  return response.data;
};

export const addReservation = async (data) => {
  const response = await api.post('/reservasi', data);
  return response.data;
};
