import axios from 'axios';

// Create a base axios instance with default configurations
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Base URL of your NestJS backend
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});
    
// Request interceptor for handling common request configurations
api.interceptors.request.use(
  (config) => {
    // You can add auth token if needed in the future
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
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