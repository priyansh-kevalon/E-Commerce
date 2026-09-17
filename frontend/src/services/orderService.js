import api from './api.js';

/**
 * Place an order from the authenticated user's server cart.
 * Returns the created order.
 */
export const createOrder = async (payload) => {
  const { data } = await api.post('/orders', payload);
  return data.data.order;
};

/**
 * List the authenticated user's orders (newest first).
 */
export const fetchMyOrders = async () => {
  const { data } = await api.get('/orders/myorders');
  return data.data.orders;
};

/**
 * Fetch a single order by id (owner or admin).
 */
export const fetchOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data.data.order;
};

/**
 * Cancel an order that has not shipped yet.
 */
export const cancelOrder = async (id) => {
  const { data } = await api.put(`/orders/${id}/cancel`);
  return data.data.order;
};
