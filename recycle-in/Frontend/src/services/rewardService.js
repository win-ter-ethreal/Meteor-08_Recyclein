import api from './api';

export const getRewards = async () => {
  const response = await api.get('/rewards');
  return response.data;
};

export const redeemReward = async (id_reward) => {
  const response = await api.post('/rewards/redeem', { id_reward });
  return response.data;
};
