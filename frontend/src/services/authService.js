import api from './api.js';

export const AUTH_TOKEN_KEY = 'velmora_token';

/**
 * Register a new customer and return { token, user }.
 */
export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data.data;
};

/**
 * Authenticate a user and return { token, user }.
 */
export const loginUser = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data.data;
};

/**
 * Fetch the user tied to the stored JWT.
 */
export const fetchCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data.data.user;
};
