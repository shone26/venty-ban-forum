// src/api/bans.ts
import axios from './axios';
import { Ban, BanListResponse, BanQueryParams, CreateBanData, UpdateBanData } from '../types';

const BASE_PATH = '/bans';

export const getBans = async (params: BanQueryParams = {}): Promise<BanListResponse> => {
  const response = await axios.get(BASE_PATH, { params });
  return response.data;
};

export const getBanById = async (id: string): Promise<Ban> => {
  const response = await axios.get(`${BASE_PATH}/${id}`);
  return response.data;
};

export const createBan = async (data: CreateBanData): Promise<Ban> => {
  const response = await axios.post(BASE_PATH, data);
  return response.data;
};

export const updateBan = async (id: string, data: UpdateBanData): Promise<Ban> => {
  const response = await axios.patch(`${BASE_PATH}/${id}`, data);
  return response.data;
};

export const deleteBan = async (id: string): Promise<{ deleted: boolean }> => {
  const response = await axios.delete(`${BASE_PATH}/${id}`);
  return response.data;
};

export const checkActiveBan = async (steamId: string): Promise<Ban | null> => {
  const response = await axios.get(`${BASE_PATH}/check/${steamId}`);
  return response.data;
};