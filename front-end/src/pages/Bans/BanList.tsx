import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ban, BanQueryParams } from '../../api/types';
import BanApi from '../../api/bans';

import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { Table, TableColumn } from '../../components/common/Table';
import { Pagination } from '../../components/common/Pagination';

import { BanStatusBadge } from '../../components/bans/BanStatusBadge';
import { BanSearchFilters } from '../../components/bans/BanSearchFilters';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../context/ToastContext';

const BanList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // State for bans data
  const [bans, setBans] = useState<Ban[]>([]);
  const [totalBans, setTotalBans] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // State for pagination and filtering
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });
  
  const [filters, setFilters] = useState<BanQueryParams>({
    status: '',
    search: '',
    steamId: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  
  // Fetch bans based on filters and pagination
  useEffect(() => {
    const fetchBans = async () => {
      try {
        setLoading(true);
        
        // Prepare query params
        const queryParams: BanQueryParams = {
          page: pagination.currentPage,
          limit: pagination.pageSize,
          ...filters,
        };
        
        // Remove empty string values
        Object.keys(queryParams).forEach((key) => {
          const typedKey = key as keyof BanQueryParams;
          if (queryParams[typedKey] === '') {
            delete queryParams[typedKey];
          }
        });
        
        const response = await BanApi.getAllBans(queryParams);
        
        setBans(response.bans);
        setTotalBans(response.total);
      } catch (error) {
        console.error('Failed to fetch bans:', error);
        showToast('error', 'Failed to load bans. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBans();
  }, [pagination.currentPage, pagination.pageSize, filters]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination({
      ...pagination,
      currentPage: page,
    });
  };
  
  // Handle page size change
  const handlePageSizeChange = (pageSize: number) => {
    setPagination({
      currentPage: 1, // Reset to first page when changing page size
      pageSize,
    });
  };
  
  // Handle search input
  const handleSearch = (search: string) => {
    setFilters({
      ...filters,
      search,
    });
    setPagination({
      ...pagination,
      currentPage: 1, // Reset to first page on new search
    });
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<BanQueryParams>) => {
    setFilters({
      ...filters,
      ...newFilters,
    });
    setPagination({
      ...pagination,
      currentPage: 1, // Reset to first page on filter change
    });
  };
  
  // Navigate to ban details
  const handleBanClick = (ban: Ban) => {
    navigate(`/bans/${ban._id}`);
  };
  
  // Navigate to create ban page
  const handleCreateBan = () => {
    navigate('/bans/create');
  };
  
  // Define table columns
  const columns: TableColumn<Ban>[] = [
    {
      id: 'playerName',
      header: 'Player',
      cell: (ban) => (
        <div>
          <div className="font-medium text-gray-900">{ban.playerName}</div>
          <div className="text-xs text-gray-500 font-mono">{ban.steamId}</div>
        </div>
      ),
    },
    {
      id: 'reason',
      header: 'Reason',
      cell: (ban) => (
        <div className="max-w-xs truncate" title={ban.reason}>
          {ban.reason}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (ban) => <BanStatusBadge status={ban.status} />,
    },
    {
      id: 'duration',
      header: 'Duration',
      cell: (ban) => (
        ban.durationType === 'permanent' ? (
          <span className="text-red-600 font-medium">Permanent</span>
        ) : (
          <span>
            {ban.expiresAt ? (
              <span>
                Expires: {formatDate(ban.expiresAt)}
              </span>
            ) : (
              'Temporary'
            )}
          </span>
        )
      ),
    },
    {
      id: 'createdAt',
      header: 'Created',
      cell: (ban) => formatDate(ban.createdAt),
    },
  ];
  
  return (
    
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Player Bans</h1>
          <Button
            variant="primary"
            onClick={handleCreateBan}
          >
            Create New Ban
          </Button>
        </div>
        
        <Card>
          <div className="p-6">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <SearchBar
                  placeholder="Search player name or Steam ID..."
                  value={filters.search}
                  onChange={handleSearch}
                  className="w-full md:w-1/2"
                />
                <BanSearchFilters
                  filters={{
                    status: filters.status || '',
                    steamId: filters.steamId,
                    sortBy: filters.sortBy || 'createdAt',
                    sortOrder: filters.sortOrder || 'desc',
                  }}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>
            
            <Table
              columns={columns}
              data={bans}
              onRowClick={handleBanClick}
              isLoading={loading}
              emptyMessage="No bans found. Try adjusting your filters."
            />
            
            <div className="mt-4">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={Math.ceil(totalBans / pagination.pageSize)}
                onPageChange={handlePageChange}
                pageSize={pagination.pageSize}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </div>
        </Card>
      </div>
    
  );
};

export default BanList;