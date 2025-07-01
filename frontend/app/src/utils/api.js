import axios from 'axios';
import config from '../config';

/**
 * Creates an Axios instance with credentials for cookies
 */
const createApi = () => {
  const api = axios.create({
    baseURL: config.API_BASE_URL,
    withCredentials: true, // ✅ Send cookies with every request
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // ✅ Handle auth-related responses
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          console.log('Unauthorized. Redirecting to login...');
          window.location.href = '/login';
        } else if (error.response.status === 403) {
          console.log('Access denied.');
          window.location.href = '/home';
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};

/**
 * API methods with automatic cookie handling
 */
const api = {
  get: async (url, config = {}) => {
    const instance = createApi();
    return instance.get(url, config);
  },

  post: async (url, data = {}, config = {}) => {
    const instance = createApi();
    return instance.post(url, data, config);
  },

  put: async (url, data = {}, config = {}) => {
    const instance = createApi();
    return instance.put(url, data, config);
  },

  delete: async (url, config = {}) => {
    const instance = createApi();
    return instance.delete(url, config);
  }
};

export default api;
