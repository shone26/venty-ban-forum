// src/api/appeals.ts
import axios from './axios';
import { Appeal, AppealListResponse, AppealQueryParams, CreateAppealData, UpdateAppealData } from '../types';

const BASE_PATH = '/appeals';

export const getAppeals = async (params: AppealQueryParams = {}): Promise<AppealListResponse> => {
  const response = await axios.get(BASE_PATH, { params });
  return response.data;
};

export const getAppealById = async (id: string): Promise<Appeal> => {
  const response = await axios.get(`${BASE_PATH}/${id}`);
  return response.data;
};

export const createAppeal = async (data: CreateAppealData): Promise<Appeal> => {
  const response = await axios.post(BASE_PATH, data);
  return response.data;
};

export const updateAppeal = async (id: string, data: UpdateAppealData): Promise<Appeal> => {
  const response = await axios.patch(`${BASE_PATH}/${id}`, data);
  return response.data;
};

export const deleteAppeal = async (id: string): Promise<{ deleted: boolean }> => {
  const response = await axios.delete(`${BASE_PATH}/${id}`);
  return response.data;
};