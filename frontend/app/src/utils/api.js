import axios from 'axios';
import config from '../config';

/**
 * Creates an authenticated API instance
 * @returns {Object} Axios instance with authorization header
 */
export const createAuthenticatedApi = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const api = axios.create({
    baseURL: config.API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });

  // Add response interceptor to handle 401 and 403 errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          console.log('Unauthorized access. Redirecting to login...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else if (error.response.status === 403) {
          console.log('Access denied. Insufficient privileges.');
          if (user.role !== 'admin') {
            window.location.href = '/home';
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};

/**
 * Api utility for making authenticated requests
 */
const api = {
  get: async (url, config = {}) => {
    const authApi = createAuthenticatedApi();
    return authApi.get(url, config);
  },
  
  post: async (url, data = {}, config = {}) => {
    const authApi = createAuthenticatedApi();
    return authApi.post(url, data, config);
  },
  
  put: async (url, data = {}, config = {}) => {
    const authApi = createAuthenticatedApi();
    return authApi.put(url, data, config);
  },
  
  delete: async (url, config = {}) => {
    const authApi = createAuthenticatedApi();
    return authApi.delete(url, config);
  }
};

export default api; 