// src/services/api.ts
import axios, { AxiosRequestConfig } from 'axios';
import { 
  Ban, 
  BanQueryParams, 
  BansResponse,
  Appeal,
  AppealQueryParams,
  AppealsResponse
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Ban API functions
export const bansApi = {
  getBans: async (params: BanQueryParams = {}): Promise<BansResponse> => {
    const response = await apiClient.get('/bans', { params });
    return response.data;
  },

  getBanById: async (id: string): Promise<Ban> => {
    const response = await apiClient.get(`/bans/${id}`);
    return response.data;
  },

  createBan: async (banData: FormData | Partial<Ban>): Promise<Ban> => {
    // If the banData is a FormData, use it directly with appropriate headers
    const isFormData = banData instanceof FormData;
    
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    };
    
    const response = await apiClient.post('/bans', banData, config);
    return response.data;
  },

  updateBan: async (id: string, banData: FormData | Partial<Ban>): Promise<Ban> => {
    // If the banData is a FormData, use it directly with appropriate headers
    const isFormData = banData instanceof FormData;
    
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    };
    
    const response = await apiClient.patch(`/bans/${id}`, banData, config);
    return response.data;
  },

  deleteBan: async (id: string): Promise<{ deleted: boolean }> => {
    const response = await apiClient.delete(`/bans/${id}`);
    return response.data;
  },

  checkBan: async (steamId: string): Promise<Ban | null> => {
    const response = await apiClient.get(`/bans/check/${steamId}`);
    return response.data;
  },
};

// Appeals API functions
export const appealsApi = {
  getAppeals: async (params: AppealQueryParams = {}): Promise<AppealsResponse> => {
    const response = await apiClient.get('/appeals', { params });
    return response.data;
  },

  getAppealById: async (id: string): Promise<Appeal> => {
    const response = await apiClient.get(`/appeals/${id}`);
    return response.data;
  },

  createAppeal: async (appealData: FormData | Partial<Appeal>): Promise<Appeal> => {
    // If the appealData is a FormData, use it directly with appropriate headers
    const isFormData = appealData instanceof FormData;
    
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    };
    
    const response = await apiClient.post('/appeals', appealData, config);
    return response.data;
  },

  updateAppeal: async (id: string, appealData: FormData | Partial<Appeal>): Promise<Appeal> => {
    // If the appealData is a FormData, use it directly with appropriate headers
    const isFormData = appealData instanceof FormData;
    
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    };
    
    const response = await apiClient.patch(`/appeals/${id}`, appealData, config);
    return response.data;
  },

  deleteAppeal: async (id: string): Promise<{ deleted: boolean }> => {
    const response = await apiClient.delete(`/appeals/${id}`);
    return response.data;
  },
};

// Users API (simplified)
export const usersApi = {
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },
};

export default {
  bans: bansApi,
  appeals: appealsApi,
  users: usersApi,
};