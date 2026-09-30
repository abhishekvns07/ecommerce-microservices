import axios from 'axios';

// Base Axios instance pointing to API Gateway
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for logging & error handling
API.interceptors.request.use(
  (config) => {
    console.log(`[API Gateway Call] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Gateway Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;
