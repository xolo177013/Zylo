import api from './axios';

export const createOrderApi = (payload) => api.post('/orders', payload).then((res) => res.data);

export const retryPaymentApi = (orderId) =>
  api.post(`/orders/${orderId}/pay`).then((res) => res.data);

export const getMyOrdersApi = () => api.get('/orders/myorders').then((res) => res.data);

export const getOrderByIdApi = (orderId) => api.get(`/orders/${orderId}`).then((res) => res.data);
