import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = (username, password) => {
  return api.post('/auth/login', { username, password });
};

export const register = (username, password, role) => {
  return api.post('/auth/register', { username, password, role });
};

export const purchaseTicket = (ticketType, email) => {
  return api.post('/payments/create-checkout-session', { ticketType, email });
};

export const confirmPayment = (sessionId) => {
  return api.post('/payments/payment-success', { session_id: sessionId });
};

export const getMyTickets = () => {
  return api.get('/tickets/my-tickets');
};

export const validateTicket = (qrCode) => {
  return api.post('/tickets/validate', { qrCode });
};

export const getAnalytics = () => {
  return api.get('/admin/analytics');
};

export const getAllUsers = () => {
  return api.get('/admin/users');
};

export const updateUserRole = (userId, role) => {
  return api.patch(`/admin/users/${userId}`, { role });
};

export const generateQRCode = () => {
  return api.post('/admin/generate-qr');
};

export default api;