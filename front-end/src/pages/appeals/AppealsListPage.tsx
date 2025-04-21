// src/pages/appeals/AppealsListPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Card from '../../components/common/Card';
import Table, { TableColumn } from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import AppealStatusBadge from '../../components/appeals/AppealStatusBadge';
import { Appeal, AppealQueryParams, AppealStatus } from '../../types';
import { useToast } from '../../components/common/ToastContext';
import { getAppeals } from '../../api/apeals';


interface AppealFilters {
  status?: AppealStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const AppealsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [totalAppeals, setTotalAppeals] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filters, setFilters] = useState<AppealQueryParams>({
    status: AppealStatus.PENDING,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchAppeals();
  }, [currentPage, pageSize, filters]);

  const fetchAppeals = async () => {
    try {
      setLoading(true);
      
      const response = await getAppeals({
        page: currentPage,
        limit: pageSize,
        ...filters
      });
      
      setAppeals(response.appeals);
      setTotalAppeals(response.total);
    } catch (error) {
      console.error('Error fetching appeals:', error);
      showToast('error', 'Failed to load appeals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (status: AppealStatus | '') => {
    setFilters(prev => ({ 
      ...prev, 
      status: status || undefined
    }));
    setCurrentPage(1);
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc' = 'desc') => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleAppealClick = (appeal: Appeal) => {
    navigate(`/appeals/${appeal._id}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PP');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const columns: TableColumn<Appeal>[] = [
    {
      id: 'appealedBy',
      header: 'Appealed By',
      cell: (appeal) => {
        if (typeof appeal.appealedBy === 'object') {
          return appeal.appealedBy.username;
        }
        return 'Unknown';
      },
    },
    {
      id: 'ban',
      header: 'Ban Info',
      cell: (appeal) => {
        if (typeof appeal.ban === 'object') {
          return (
            <div>
              <div>{appeal.ban.playerName}</div>
              <div className="text-xs text-gray-500">{appeal.ban.steamId}</div>
            </div>
          );
        }
        return 'Unknown Ban';
      },
    },
    {
      id: 'reason',
      header: 'Reason',
      cell: (appeal) => (
        <div className="max-w-xs truncate" title={appeal.reason}>
          {appeal.reason}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (appeal) => <AppealStatusBadge status={appeal.status} />,
    },
    {
      id: 'createdAt',
      header: 'Date',
      cell: (appeal) => formatDate(appeal.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Appeal Requests</h1>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="flex space-x-2">
              <Button
                variant={!filters.status ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('')}
              >
                All
              </Button>
              <Button
                variant={filters.status === AppealStatus.PENDING ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange(AppealStatus.PENDING)}
              >
                Pending
              </Button>
              <Button
                variant={filters.status === AppealStatus.APPROVED ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange(AppealStatus.APPROVED)}
              >
                Approved
              </Button>
              <Button
                variant={filters.status === AppealStatus.REJECTED ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange(AppealStatus.REJECTED)}
              >
                Rejected
              </Button>
            </div>

            <div className="flex space-x-2">
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleSortChange(sortBy, sortOrder as 'asc' | 'desc');
                }}
                className="border border-gray-300 rounded-md text-sm"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
              </select>
            </div>
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
              data={appeals} 
              onRowClick={handleAppealClick}
              emptyMessage="No appeals found matching your criteria."
            />
              
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-sm text-gray-500 mb-4 md:mb-0">
                  Showing {appeals.length} of {totalAppeals} results
                </div>
                <Pagination 
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalAppeals / pageSize)}
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

export default AppealsListPage;