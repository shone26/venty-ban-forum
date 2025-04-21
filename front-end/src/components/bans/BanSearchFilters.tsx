import React from 'react';
import { BanStatus } from '../../api/types';

interface BanSearchFiltersProps {
  filters: {
    status: string;
    steamId?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  onFilterChange: (newFilters: Partial<BanSearchFiltersProps['filters']>) => void;
  className?: string;
}

export const BanSearchFilters: React.FC<BanSearchFiltersProps> = ({
  filters,
  onFilterChange,
  className = '',
}) => {
  // Handle status filter change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ status: e.target.value });
  };
  
  // Handle sort field change
  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ sortBy: e.target.value });
  };
  
  // Handle sort order change
  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ sortOrder: e.target.value as 'asc' | 'desc' });
  };
  
  // Handle Steam ID filter input
  const handleSteamIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ steamId: e.target.value });
  };
  
  return (
    <div className={`flex flex-col md:flex-row gap-3 ${className}`}>
      {/* Status filter */}
      <div>
        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status-filter"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={filters.status}
          onChange={handleStatusChange}
        >
          <option value="">All Statuses</option>
          {Object.values(BanStatus).map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      {/* Steam ID filter */}
      <div>
        <label htmlFor="steamid-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Steam ID
        </label>
        <input
          id="steamid-filter"
          type="text"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Filter by Steam ID"
          value={filters.steamId || ''}
          onChange={handleSteamIdChange}
        />
      </div>
      
      {/* Sort By filter */}
      <div>
        <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          id="sort-by"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={filters.sortBy}
          onChange={handleSortByChange}
        >
          <option value="createdAt">Date Created</option>
          <option value="expiresAt">Expiration Date</option>
          <option value="playerName">Player Name</option>
          <option value="status">Status</option>
        </select>
      </div>
      
      {/* Sort Order filter */}
      <div>
        <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-1">
          Order
        </label>
        <select
          id="sort-order"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={filters.sortOrder}
          onChange={handleSortOrderChange}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
};