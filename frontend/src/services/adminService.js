import api from './api.js';

// -------------------- Statistics --------------------

export const fetchDashboardStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data.data;
};

// -------------------- Products --------------------

export const createProduct = async (payload) => {
  const { data } = await api.post('/products', payload);
  return data.data.product;
};

export const updateProduct = async (id, payload) => {
  const { data } = await api.put(`/products/${id}`, payload);
  return data.data.product;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

// -------------------- Categories --------------------

export const createCategory = async (payload) => {
  const { data } = await api.post('/categories', payload);
  return data.data.category;
};

export const updateCategory = async (id, payload) => {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data.data.category;
};

export const deleteCategory = async (id) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
};

// -------------------- Users --------------------

export const fetchUsers = async (params = {}) => {
  const { data } = await api.get('/users', { params });
  return data.data.users;
};

export const updateUser = async (id, payload) => {
  const { data } = await api.put(`/users/${id}`, payload);
  return data.data.user;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};

// -------------------- Orders --------------------

export const fetchAllOrders = async (params = {}) => {
  const { data } = await api.get('/orders', { params });
  return data.data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`/orders/${id}/status`, { status });
  return data.data.order;
};
