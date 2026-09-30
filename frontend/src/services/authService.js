import api from '../api/axiosInstance';

export const authService = {
  login: async (usernameOrEmail, password) => {
    const response = await api.post('/api/auth/login', { usernameOrEmail, password });
    if (response.data.token) {
      localStorage.setItem('jwt_token', response.data.token);
      localStorage.setItem('user_info', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (username, email, password, role = 'ROLE_USER') => {
    const response = await api.post('/api/auth/register', { username, email, password, role });
    if (response.data.token) {
      localStorage.setItem('jwt_token', response.data.token);
      localStorage.setItem('user_info', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
    window.dispatchEvent(new Event('auth-logout-event'));
  },

  getToken: () => localStorage.getItem('jwt_token'),

  getStoredUser: () => {
    const userStr = localStorage.getItem('user_info');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },

  checkAuthHealth: async () => {
    try {
      const res = await api.get('/api/auth/health');
      return res.data;
    } catch (e) {
      return { service: 'auth-service', status: 'DOWN', error: e.message };
    }
  }
};
