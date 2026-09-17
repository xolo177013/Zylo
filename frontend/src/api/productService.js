import api from './axios';

export const getProductsApi = (params) => api.get('/products', { params }).then((res) => res.data);

export const getCategoriesApi = () => api.get('/products/categories').then((res) => res.data);

export const getProductApi = (idOrSlug) => api.get(`/products/${idOrSlug}`).then((res) => res.data);

export const addReviewApi = (productId, payload) =>
  api.post(`/products/${productId}/reviews`, payload).then((res) => res.data);
