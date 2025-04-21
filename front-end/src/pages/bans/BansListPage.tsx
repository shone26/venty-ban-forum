// src/pages/bans/BansListPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Card from '../../components/common/Card';
import Table, { TableColumn } from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import BanStatusBadge from '../../components/bans/BanStatusBadge';
import BanSearchFilters from '../../components/bans/BanSearchFilters';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { Ban, BanQueryParams } from '../../types';
import { getBans } from '../../api/bans';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/ToastContext';


const BansListPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasPermission } = useAuth();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [bans, setBans] = useState<Ban[]>([]);
  const [totalBans, setTotalBans] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filters, setFilters] = useState<BanQueryParams>({
    status: '',
    search: '',
    steamId: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchBans();
  }, [currentPage, pageSize, filters]);

  const fetchBans = async () => {
    try {
      setLoading(true);
      
      const response = await getBans({
        page: currentPage,
        limit: pageSize,
        ...filters
      });
      
      setBans(response.bans);
      setTotalBans(response.total);
    } catch (error) {
      console.error('Error fetching bans:', error);
      showToast('error', 'Failed to load bans. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<BanQueryParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleBanClick = (ban: Ban) => {
    navigate(`/bans/${ban._id}`);
  };

  const handleCreateBan = () => {
    navigate('/bans/create');
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PP');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const columns: TableColumn<Ban>[] = [
    {
      id: 'playerName',
      header: 'Player',
      cell: (ban) => ban.playerName,
    },
    {
      id: 'steamId',
      header: 'Steam ID',
      cell: (ban) => (
        <span className="font-mono text-xs">{ban.steamId}</span>
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
      id: 'createdAt',
      header: 'Date',
      cell: (ban) => formatDate(ban.createdAt),
    },
    {
      id: 'expiresAt',
      header: 'Expires',
      cell: (ban) => ban.durationType === 'permanent' 
        ? 'Never' 
        : (ban.expiresAt ? formatDate(ban.expiresAt) : 'N/A'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Player Bans</h1>
        {isAuthenticated && hasPermission(['admin', 'moderator']) && (
          <Button 
            variant="primary" 
            onClick={handleCreateBan}
          >
            Create New Ban
          </Button>
        )}
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <SearchBar 
              placeholder="Search player name or Steam ID..." 
              value={filters.search || ''}
              onChange={handleSearch}
              className="w-full md:w-1/2"
            />
            <BanSearchFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </div>
        </div>
          
        {loading ? (
          <div className="flex justify-center p-8">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <Table 
              columns={columns} 
              data={bans} 
              onRowClick={handleBanClick}
              emptyMessage="No bans found matching your criteria."
            />
              
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-sm text-gray-500 mb-4 md:mb-0">
                  Showing {bans.length} of {totalBans} results
                </div>
                <Pagination 
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalBans / pageSize)}
                  onPageChange={handlePageChange}
                  pageSize={pageSize}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default BansListPage;