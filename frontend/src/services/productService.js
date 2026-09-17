import api from './api.js';

/**
 * Fetch a paginated/filtered list of products.
 * @param {object} params search, category, minPrice, maxPrice, sort, page, limit, featured, inStock, minRating
 * @returns {{ products: Array, pagination: object }}
 */
export const fetchProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data.data;
};

/**
 * Fetch a single product by id.
 * @returns {object} product
 */
export const fetchProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data.data.product;
};

/**
 * Fetch categories.
 * @param {object} params status, withCount
 * @returns {Array} categories
 */
export const fetchCategories = async (params = {}) => {
  const { data } = await api.get('/categories', { params });
  return data.data.categories;
};
