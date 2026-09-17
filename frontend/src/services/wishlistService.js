import api from './api.js';

// Map the API wishlist payload into an array of populated products.
const mapWishlist = (data) => data?.wishlist?.products || [];

export const fetchWishlist = async () => {
  const { data } = await api.get('/wishlist');
  return mapWishlist(data.data);
};

export const addWishlistItem = async (productId) => {
  const { data } = await api.post(`/wishlist/${productId}`);
  return mapWishlist(data.data);
};

export const removeWishlistItem = async (productId) => {
  const { data } = await api.delete(`/wishlist/${productId}`);
  return mapWishlist(data.data);
};
