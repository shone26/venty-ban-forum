// src/hooks/useBans.ts
import { useState, useEffect } from 'react';

import { Ban } from '../interfaces/Ban';
import { useNotification } from '../context/NotificationContext';
import { getAllBans, searchBans } from '../services/api';

interface UseBansOptions {
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
  searchQuery?: string;
}

interface BansData {
  bans: Ban[];
  totalPages: number;
  totalBans: number;
  page: number;
}

export const useBans = (options: UseBansOptions = {}) => {
  const { page = 1, limit = 10, filters = {}, searchQuery = '' } = options;
  const [data, setData] = useState<BansData>({
    bans: [],
    totalPages: 0,
    totalBans: 0,
    page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchBans = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        
        if (searchQuery.trim()) {
          response = await searchBans(searchQuery, page, limit);
        } else {
          response = await getAllBans(page, limit, filters);
        }
        
        setData({
          bans: response.bans,
          totalPages: response.totalPages,
          totalBans: response.total,
          page: response.page,
        });
      } catch (err) {
        console.error('Error fetching bans:', err);
        setError('Failed to load bans. Please try again.');
        addNotification('error', 'Failed to load bans');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBans();
  }, [page, limit, searchQuery, addNotification, JSON.stringify(filters)]);

  return {
    bans: data.bans,
    totalPages: data.totalPages,
    totalBans: data.totalBans,
    currentPage: data.page,
    loading,
    error,
  };
};