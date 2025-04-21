import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

// Create a base axios instance with default configurations
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  }
});
    
// Request interceptor for adding authentication token
api.interceptors.request.use(
  async (config) => {
    try {
      // Get the Clerk session token
      const { getToken } = useAuth();
      const token = await getToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error('Error getting authentication token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common response processing
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors (like 401, 403, 500, etc.)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      
      // Handle specific error scenarios
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login or refresh token
          break;
        case 403:
          // Forbidden - handle access denied
          break;
        case 500:
          // Server error
          break;
        default:
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;