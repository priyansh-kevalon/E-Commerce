import api from './api.js';

// -------------------- Overview --------------------

export const fetchSellerOverview = async () => {
  const { data } = await api.get('/seller/overview');
  return data.data.overview;
};

// -------------------- Products --------------------

export const fetchMyProducts = async (params = {}) => {
  const { data } = await api.get('/seller/products', { params });
  return data.data;
};

export const createMyProduct = async (payload) => {
  const { data } = await api.post('/seller/products', payload);
  return data.data.product;
};

export const updateMyProduct = async (id, payload) => {
  const { data } = await api.put(`/seller/products/${id}`, payload);
  return data.data.product;
};

export const deleteMyProduct = async (id) => {
  const { data } = await api.delete(`/seller/products/${id}`);
  return data;
};

// -------------------- Orders --------------------

export const fetchSellerOrders = async (params = {}) => {
  const { data } = await api.get('/seller/orders', { params });
  return data.data;
};