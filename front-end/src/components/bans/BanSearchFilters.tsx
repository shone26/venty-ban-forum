// src/components/bans/BanSearchFilters.tsx
import React from 'react';

interface BanSearchFiltersProps {
  filters: {
    isActive?: boolean;
    adminId?: string;
    // Add more filter properties as needed
  };
  onFilterChange: (newFilters: any) => void;
}

const BanSearchFilters: React.FC<BanSearchFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let isActive;
    
    if (value === 'all') {
      // Remove the isActive filter
      const { isActive, ...rest } = filters;
      onFilterChange(rest);
      return;
    } else if (value === 'active') {
      isActive = true;
    } else if (value === 'inactive') {
      isActive = false;
    }
    
    onFilterChange({ ...filters, isActive });
  };
  
  const getStatusValue = () => {
    if (filters.isActive === undefined) return 'all';
    return filters.isActive ? 'active' : 'inactive';
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Status filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={getStatusValue()}
            onChange={handleStatusChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        {/* Date range filter could be added here */}
        {/* <div>
          <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <select
            id="date-filter"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div> */}
        
        {/* More filters could be added here */}
      </div>
      
      {/* Clear filters button */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => onFilterChange({})}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default BanSearchFilters;