import api from './axios';
import { Appeal, AppealQueryParams, AppealResponse, CreateAppealDto, UpdateAppealDto } from './types';

// Appeal API endpoints
const AppealApi = {
  // Get all appeals with optional filtering
  getAllAppeals: async (params: AppealQueryParams = {}): Promise<AppealResponse> => {
    const response = await api.get('/appeals', { params });
    return response.data;
  },

  // Get a specific appeal by ID
  getAppealById: async (id: string): Promise<Appeal> => {
    const response = await api.get(`/appeals/${id}`);
    return response.data;
  },

  // Create a new appeal
  createAppeal: async (appealData: CreateAppealDto): Promise<Appeal> => {
    const response = await api.post('/appeals', appealData);
    return response.data;
  },

  // Update an existing appeal
  updateAppeal: async (id: string, appealData: UpdateAppealDto): Promise<Appeal> => {
    const response = await api.patch(`/appeals/${id}`, appealData);
    return response.data;
  },

  // Delete an appeal
  deleteAppeal: async (id: string): Promise<{ deleted: boolean }> => {
    const response = await api.delete(`/appeals/${id}`);
    return response.data;
  },

  // Get appeals for a specific ban
  getAppealsByBanId: async (banId: string): Promise<Appeal[]> => {
    const response = await api.get(`/appeals?ban=${banId}`);
    return response.data.appeals || [];
  }
};

export default AppealApi;