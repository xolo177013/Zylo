import api from './axios';

export const registerApi = (payload) => api.post('/auth/register', payload).then((res) => res.data);

export const loginApi = (payload) => api.post('/auth/login', payload).then((res) => res.data);

export const getMeApi = () => api.get('/auth/me').then((res) => res.data);

export const updateMeApi = (payload) => api.put('/auth/me', payload).then((res) => res.data);
