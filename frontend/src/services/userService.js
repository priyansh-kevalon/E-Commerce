import api from './api.js';

/**
 * Update the authenticated user's name and/or email.
 * Returns the updated user.
 */
export const updateProfile = async (payload) => {
  const { data } = await api.put('/users/profile', payload);
  return data.data.user;
};

/**
 * Change the authenticated user's password.
 */
export const changePassword = async (payload) => {
  const { data } = await api.put('/users/password', payload);
  return data;
};

/**
 * Apply to become a seller. Puts the account into a pending state that an
 * admin has to approve.
 */
export const requestSellerAccount = async () => {
  const { data } = await api.post('/users/seller-request');
  return data.data;
};
