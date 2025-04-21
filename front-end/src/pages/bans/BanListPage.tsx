// src/pages/bans/BanListPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ban, BanQueryParams, BanStatus } from '../../types';
import { bansApi } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { SearchInput } from '../../components/ui/SearchInput';
import { Pagination } from '../../components/ui/Pagination';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Alert } from '../../components/ui/Alert';

// Ban Filter Component
const BanFilter: React.FC<{
  filters: BanQueryParams;
  onFilterChange: (filters: Partial<BanQueryParams>) => void;
}> = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <div>
        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ status: e.target.value as BanStatus || undefined })}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          {Object.values(BanStatus).map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <select
          value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            onFilterChange({ 
              sortBy, 
              sortOrder: sortOrder as 'asc' | 'desc' 
            });
          }}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="playerName-asc">Player Name (A-Z)</option>
          <option value="playerName-desc">Player Name (Z-A)</option>
          <option value="expiresAt-asc">Expiration (Soonest)</option>
          <option value="expiresAt-desc">Expiration (Latest)</option>
        </select>
      </div>
    </div>
  );
};

const BanListPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [bans, setBans] = useState<Ban[]>([]);
  const [totalBans, setTotalBans] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination and filters
  const [filters, setFilters] = useState<BanQueryParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  
  // Fetch bans with current filters
  useEffect(() => {
    const fetchBans = async () => {
      try {
        setLoading(true);
        const response = await bansApi.getBans(filters);
        setBans(response.bans);
        setTotalBans(response.total);
      } catch (err: any) {
        console.error('Error fetching bans:', err);
        setError(err.response?.data?.message || 'Failed to fetch bans.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBans();
  }, [filters]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<BanQueryParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };
  
  // Handle search
  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };
  
  // Handle row click
  const handleRowClick = (ban: Ban) => {
    navigate(`/bans/${ban._id}`);
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Table columns
  const columns = [
    {
      id: 'playerName',
      header: 'Player',
      cell: (ban: Ban) => ban.playerName,
      sortable: true,
    },
    {
      id: 'steamId',
      header: 'Steam ID',
      cell: (ban: Ban) => (
        <span className="font-mono">{ban.steamId}</span>
      ),
      sortable: true,
    },
    {
      id: 'reason',
      header: 'Reason',
      cell: (ban: Ban) => (
        <div className="max-w-xs truncate" title={ban.reason}>
          {ban.reason}
        </div>
      ),
      sortable: false,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (ban: Ban) => <StatusBadge status={ban.status} />,
      sortable: true,
    },
    {
      id: 'durationType',
      header: 'Duration',
      cell: (ban: Ban) => ban.durationType === 'permanent' ? 'Permanent' : 'Temporary',
      sortable: true,
    },
    {
      id: 'createdAt',
      header: 'Created',
      cell: (ban: Ban) => formatDate(ban.createdAt),
      sortable: true,
    },
    {
      id: 'expiresAt',
      header: 'Expires',
      cell: (ban: Ban) => 
        ban.durationType === 'permanent' 
          ? 'Never' 
          : formatDate(ban.expiresAt),
      sortable: true,
    },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bans</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/bans/create')}
        >
          Create New Ban
        </Button>
      </div>
      
      {error && (
        <Alert
          variant="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}
      
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <SearchInput
              value={filters.search || ''}
              onChange={handleSearch}
              placeholder="Search player name or Steam ID..."
              className="sm:w-80"
            />
            <BanFilter 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : bans.length === 0 ? (
            <div className="bg-gray-50 py-10 px-4 text-center rounded-md">
              <p className="text-gray-600">No bans found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  data={bans}
                  onRowClick={handleRowClick}
                  sortColumn={filters.sortBy}
                  sortDirection={filters.sortOrder}
                  onSort={(columnId) => {
                    if (filters.sortBy === columnId) {
                      // Toggle sort direction
                      handleFilterChange({
                        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
                      });
                    } else {
                      // New column, default to desc
                      handleFilterChange({
                        sortBy: columnId,
                        sortOrder: 'desc',
                      });
                    }
                  }}
                />
              </div>
              
              <div className="mt-6">
                <Pagination
                  currentPage={filters.page || 1}
                  totalPages={Math.ceil(totalBans / (filters.limit || 10))}
                  onPageChange={handlePageChange}
                  pageSize={filters.limit}
                  pageSizeOptions={[10, 25, 50, 100]}
                  onPageSizeChange={(limit) => handleFilterChange({ limit })}
                />
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BanListPage;