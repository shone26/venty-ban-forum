// src/services/api.ts
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;

// src/services/banService.ts

import { Ban } from '../interfaces/Ban';

export const getAllBans = async (page = 1, limit = 10, filters = {}) => {
  try {
    const response = await api.get('/bans', { 
      params: { 
        page, 
        limit,
        ...filters
      } 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bans:', error);
    throw error;
  }
};

export const getBanById = async (id: string) => {
  try {
    const response = await api.get(`/bans/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ban ${id}:`, error);
    throw error;
  }
};

export const createBan = async (banData: Omit<Ban, '_id' | 'createdAt'>) => {
  try {
    const response = await api.post('/bans', banData);
    return response.data;
  } catch (error) {
    console.error('Error creating ban:', error);
    throw error;
  }
};

export const updateBan = async (id: string, banData: Partial<Ban>) => {
  try {
    const response = await api.put(`/bans/${id}`, banData);
    return response.data;
  } catch (error) {
    console.error(`Error updating ban ${id}:`, error);
    throw error;
  }
};

export const deleteBan = async (id: string) => {
  try {
    const response = await api.delete(`/bans/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting ban ${id}:`, error);
    throw error;
  }
};

export const searchBans = async (query: string, page = 1, limit = 10) => {
  try {
    const response = await api.get('/bans/search', { 
      params: { 
        q: query,
        page, 
        limit 
      } 
    });
    return response.data;
  } catch (error) {
    console.error('Error searching bans:', error);
    throw error;
  }
};