// src/features/bans/pages/BansListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/common/Card';
import { Table } from '../../../components/common/Table';
import { SearchBar } from '../../../components/common/SearchBar';
import { Pagination } from '../../../components/common/Pagination';
import { BanStatusBadge } from '../components/BanStatusBadge';
import { BanSearchFilters } from '../../../components/bans/BanSearchFilters';
import { Button } from '../../../components/common/Button';
import { Spinner } from '../../../components/common/Spinner';
import { useAuth } from '../../../hooks/useAuth';
import { formatDate } from '../../../utils/formatters';

const BansListPage = () => {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bans, setBans] = useState([]);
  const [totalBans, setTotalBans] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    steamId: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchBans();
  }, [currentPage, limit, filters]);

  const fetchBans = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });
      
      const response = await fetch(`/api/bans?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bans');
      }
      
      const data = await response.json();
      setBans(data.bans);
      setTotalBans(data.total);
    } catch (error) {
      console.error('Error fetching bans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (search) => {
    setFilters(prev => ({ ...prev, search }));
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handleBanClick = (banId) => {
    navigate(`/bans/${banId}`);
  };

  const handleCreateBan = () => {
    navigate('/bans/create');
  };

  const columns = [
    {
      id: 'playerName',
      header: 'Player',
      cell: (ban) => ban.playerName
    },
    {
      id: 'steamId',
      header: 'Steam ID',
      cell: (ban) => ban.steamId
    },
    {
      id: 'reason',
      header: 'Reason',
      cell: (ban) => (
        <div className="max-w-xs truncate" title={ban.reason}>
          {ban.reason}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      cell: (ban) => <BanStatusBadge status={ban.status} />
    },
    {
      id: 'createdAt',
      header: 'Date',
      cell: (ban) => formatDate(ban.createdAt)
    },
    {
      id: 'expiresAt',
      header: 'Expires',
      cell: (ban) => ban.durationType === 'permanent' 
        ? 'Never' 
        : (ban.expiresAt ? formatDate(ban.expiresAt) : 'N/A')
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Player Bans</h1>
        {hasPermission(['admin', 'moderator']) && (
          <Button 
            variant="primary" 
            onClick={handleCreateBan}
          >
            Create New Ban
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <SearchBar 
              placeholder="Search player name or Steam ID..." 
              value={filters.search}
              onChange={handleSearch}
              className="w-full md:w-1/2"
            />
            <BanSearchFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
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
                onRowClick={(row) => handleBanClick(row._id)}
                className="w-full"
              />
              
              <div className="mt-4 flex flex-col md:flex-row justify-between items-center">
                <div className="text-sm text-gray-500 mb-4 md:mb-0">
                  Showing {bans.length} of {totalBans} results
                </div>
                <Pagination 
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalBans / limit)}
                  onPageChange={handlePageChange}
                  pageSize={limit}
                  onPageSizeChange={handleLimitChange}
                />
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BansListPage;