// src/components/bans/BanSearchFilters.tsx
import React from 'react';
import { BanStatus } from '../../types';

interface BanFilters {
  status?: string;
  steamId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface BanSearchFiltersProps {
  filters: BanFilters;
  onFilterChange: (filters: Partial<BanFilters>) => void;
  className?: string;
}

const BanSearchFilters: React.FC<BanSearchFiltersProps> = ({
  filters,
  onFilterChange,
  className = '',
}) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ status: e.target.value });
  };

  const handleSteamIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ steamId: e.target.value });
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ sortBy: e.target.value });
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ sortOrder: e.target.value as 'asc' | 'desc' });
  };

  const handleClearFilters = () => {
    onFilterChange({
      status: '',
      steamId: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <div className="w-full sm:w-auto">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          value={filters.status || ''}
          onChange={handleStatusChange}
          className="w-full sm:w-auto rounded-md border-gray-300 py-2 px-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          <option value={BanStatus.ACTIVE}>Active</option>
          <option value={BanStatus.EXPIRED}>Expired</option>
          <option value={BanStatus.APPEALED}>Appealed</option>
          <option value={BanStatus.REVOKED}>Revoked</option>
        </select>
      </div>

      <div className="w-full sm:w-auto">
        <label htmlFor="steamId" className="block text-sm font-medium text-gray-700 mb-1">
          Steam ID
        </label>
        <input
          type="text"
          id="steamId"
          value={filters.steamId || ''}
          onChange={handleSteamIdChange}
          placeholder="Filter by Steam ID"
          className="w-full sm:w-auto rounded-md border-gray-300 py-2 px-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div className="w-full sm:w-auto">
        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          id="sortBy"
          value={filters.sortBy || 'createdAt'}
          onChange={handleSortByChange}
          className="w-full sm:w-auto rounded-md border-gray-300 py-2 px-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="createdAt">Date Created</option>
          <option value="playerName">Player Name</option>
          <option value="expiresAt">Expiration Date</option>
        </select>
      </div>

      <div className="w-full sm:w-auto">
        <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
          Order
        </label>
        <select
          id="sortOrder"
          value={filters.sortOrder || 'desc'}
          onChange={handleSortOrderChange}
          className="w-full sm:w-auto rounded-md border-gray-300 py-2 px-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <div className="w-full sm:w-auto flex items-end">
        <button
          type="button"
          onClick={handleClearFilters}
          className="text-sm text-gray-500 hover:text-gray-700 hover:underline py-2"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default BanSearchFilters;