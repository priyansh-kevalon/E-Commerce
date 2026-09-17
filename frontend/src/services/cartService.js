import api from './api.js';

// Map the API cart payload into the shape the UI uses: [{ product, quantity }].
const mapCart = (data) =>
  (data?.cart?.items || []).map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));

export const fetchCart = async () => {
  const { data } = await api.get('/cart');
  return mapCart(data.data);
};

export const addCartItem = async (productId, quantity = 1) => {
  const { data } = await api.post('/cart', { productId, quantity });
  return mapCart(data.data);
};

export const updateCartItem = async (productId, quantity) => {
  const { data } = await api.put(`/cart/${productId}`, { quantity });
  return mapCart(data.data);
};

export const removeCartItem = async (productId) => {
  const { data } = await api.delete(`/cart/${productId}`);
  return mapCart(data.data);
};

export const clearCartRequest = async () => {
  const { data } = await api.delete('/cart');
  return mapCart(data.data);
};
