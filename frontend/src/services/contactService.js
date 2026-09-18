import api from './api.js';

/**
 * Submit a contact form message to the backend.
 * @param {Object} payload { name, email, phone, subject, message }
 * @returns {Promise<Object|null>} The stored contact message.
 */
export const submitContactMessage = async (payload) => {
  const { data } = await api.post('/contact', payload);
  return data?.data?.contactMessage || null;
};