// src/api/axios.ts
import axios from 'axios';

// Create a base axios instance with default configurations
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  }
});

// Function to set auth token
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;