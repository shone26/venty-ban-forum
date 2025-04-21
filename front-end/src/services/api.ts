// src/services/api.ts
import axios from 'axios';
import { 
  Ban, 
  BanQueryParams, 
  BansResponse,
  Appeal,
  AppealQueryParams,
  AppealsResponse
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

  createBan: async (banData: Partial<Ban>): Promise<Ban> => {
    const formData = new FormData();
    
    // Append all text fields
    Object.entries(banData).forEach(([key, value]) => {
      if (key !== 'evidencePhotos') {
        formData.append(key, value as string);
      }
    });
    
    // Append photos if they exist
    if (banData.evidencePhotos && banData.evidencePhotos.length > 0) {
      banData.evidencePhotos.forEach((photo, index) => {
        formData.append(`evidencePhotos`, photo);
      });
    }
    
    const response = await apiClient.post('/bans', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateBan: async (id: string, banData: Partial<Ban>): Promise<Ban> => {
    const formData = new FormData();
    
    // Append all text fields
    Object.entries(banData).forEach(([key, value]) => {
      if (key !== 'evidencePhotos') {
        formData.append(key, value as string);
      }
    });
    
    // Append photos if they exist
    if (banData.evidencePhotos && banData.evidencePhotos.length > 0) {
      banData.evidencePhotos.forEach((photo, index) => {
        formData.append(`evidencePhotos`, photo);
      });
    }
    
    const response = await apiClient.patch(`/bans/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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

  createAppeal: async (appealData: Partial<Appeal>): Promise<Appeal> => {
    const formData = new FormData();
    
    // Append all text fields
    Object.entries(appealData).forEach(([key, value]) => {
      if (key !== 'evidencePhotos') {
        formData.append(key, value as string);
      }
    });
    
    // Append photos if they exist
    if (appealData.evidencePhotos && appealData.evidencePhotos.length > 0) {
      appealData.evidencePhotos.forEach((photo, index) => {
        formData.append(`evidencePhotos`, photo);
      });
    }
    
    const response = await apiClient.post('/appeals', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateAppeal: async (id: string, appealData: Partial<Appeal>): Promise<Appeal> => {
    const response = await apiClient.patch(`/appeals/${id}`, appealData);
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