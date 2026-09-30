import axios from 'axios';

// Create central Axios instance
const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR: Inject JWT Bearer Token into headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log(`[Axios Request Interceptor] ${config.method?.toUpperCase()} ${config.url}`, config.headers);
    return config;
  },
  (error) => {
    console.error('[Axios Request Interceptor Error]', error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Handle global response, log, and 401 JWT Expiration
api.interceptors.response.use(
  (response) => {
    console.log(`[Axios Response Interceptor] Status ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      console.warn('[Axios Response Interceptor] 401 Unauthorized detected. Clearing JWT token...');
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_info');
      // Dispatch custom event so AuthContext updates UI state dynamically
      window.dispatchEvent(new Event('auth-logout-event'));
    }

    console.error('[Axios Response Interceptor Error]', {
      url: error.config?.url,
      status: status,
      message: error.response?.data?.message || error.message,
    });

    return Promise.reject(error);
  }
);

export default api;
