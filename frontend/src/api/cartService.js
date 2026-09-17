import api from './axios';

export const getCartApi = () => api.get('/cart').then((res) => res.data);

export const addToCartApi = (productId, quantity = 1) =>
  api.post('/cart/items', { productId, quantity }).then((res) => res.data);

export const updateCartItemApi = (itemId, quantity) =>
  api.put(`/cart/items/${itemId}`, { quantity }).then((res) => res.data);

export const removeCartItemApi = (itemId) =>
  api.delete(`/cart/items/${itemId}`).then((res) => res.data);

export const clearCartApi = () => api.delete('/cart').then((res) => res.data);
