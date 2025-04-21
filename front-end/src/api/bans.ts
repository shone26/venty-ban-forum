import api from './axios';
import { Ban, BanQueryParams, BanResponse, CreateBanDto, UpdateBanDto } from './types';

// Ban API endpoints
const BanApi = {
  // Get all bans with optional filtering
  getAllBans: async (params: BanQueryParams = {}): Promise<BanResponse> => {
    const response = await api.get('/bans', { params });
    return response.data;
  },

  // Get a specific ban by ID
  getBanById: async (id: string): Promise<Ban> => {
    const response = await api.get(`/bans/${id}`);
    return response.data;
  },

  // Check if a player has an active ban
  checkActiveBan: async (steamId: string): Promise<Ban | null> => {
    const response = await api.get(`/bans/check/${steamId}`);
    return response.data;
  },

  // Create a new ban
  createBan: async (banData: CreateBanDto): Promise<Ban> => {
    const response = await api.post('/bans', banData);
    return response.data;
  },

  // Update an existing ban
  updateBan: async (id: string, banData: UpdateBanDto): Promise<Ban> => {
    const response = await api.patch(`/bans/${id}`, banData);
    return response.data;
  },

  // Delete a ban
  deleteBan: async (id: string): Promise<{ deleted: boolean }> => {
    const response = await api.delete(`/bans/${id}`);
    return response.data;
  },

  // Get ban history for a player by Steam ID
  getBanHistoryBySteamId: async (steamId: string, currentBanId?: string): Promise<Ban[]> => {
    const params = { steamId };
    const response = await api.get('/bans', { params });
    // Filter out the current ban if provided
    if (currentBanId && response.data && response.data.bans) {
      return response.data.bans.filter((ban: Ban) => ban._id !== currentBanId);
    }
    return response.data.bans || [];
  }
};

export default BanApi;