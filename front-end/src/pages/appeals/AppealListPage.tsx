// src/pages/appeals/AppealListPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Appeal, AppealQueryParams, AppealStatus } from '../../types';
import { appealsApi } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { SearchInput } from '../../components/ui/SearchInput';
import { Pagination } from '../../components/ui/Pagination';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Alert } from '../../components/ui/Alert';
import { Modal } from '../../components/ui/Modal';
import { AppealDetails } from '../../components/appeals/AppealDetails';

// Appeal Filter Component
const AppealFilter: React.FC<{
  filters: AppealQueryParams;
  onFilterChange: (filters: Partial<AppealQueryParams>) => void;
}> = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <div>
        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ status: e.target.value as AppealStatus || undefined })}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          {Object.values(AppealStatus).map((status) => (
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
          <option value="status-asc">Status (A-Z)</option>
          <option value="status-desc">Status (Z-A)</option>
        </select>
      </div>
    </div>
  );
};

const AppealListPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [totalAppeals, setTotalAppeals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  
  // Pagination and filters
  const [filters, setFilters] = useState<AppealQueryParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  
  // Fetch appeals with current filters
  useEffect(() => {
    const fetchAppeals = async () => {
      try {
        setLoading(true);
        const response = await appealsApi.getAppeals(filters);
        setAppeals(response.appeals);
        setTotalAppeals(response.total);
      } catch (err: any) {
        console.error('Error fetching appeals:', err);
        setError(err.response?.data?.message || 'Failed to fetch appeals.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppeals();
  }, [filters]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<AppealQueryParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
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
  
  // Handle row click
  const handleRowClick = (appeal: Appeal) => {
    setSelectedAppeal(appeal);
    setShowAppealModal(true);
  };
  
  // Handle approve appeal
  const handleApproveAppeal = (appeal: Appeal) => {
    setSelectedAppeal(appeal);
    setReviewAction('approve');
    setShowReviewModal(true);
  };
  
  // Handle reject appeal
  const handleRejectAppeal = (appeal: Appeal) => {
    setSelectedAppeal(appeal);
    setReviewAction('reject');
    setShowReviewModal(true);
  };
  
  // Handle review submit
  const handleReviewSubmit = async () => {
    if (!selectedAppeal || !reviewAction) return;
    
    try {
      setReviewLoading(true);
      
      const status = reviewAction === 'approve' 
        ? AppealStatus.APPROVED 
        : AppealStatus.REJECTED;
      
      await appealsApi.updateAppeal(selectedAppeal._id, {
        status,
        reviewNotes,
      });
      
      // If approved, also update the ban status
      if (reviewAction === 'approve' && typeof selectedAppeal.ban === 'string') {
        await bansApi.updateBan(selectedAppeal.ban, { status: 'appealed' });
      }
      
      // Refresh the appeal list
      const response = await appealsApi.getAppeals(filters);
      setAppeals(response.appeals);
      setTotalAppeals(response.total);
      
      // Close modals
      setShowReviewModal(false);
      setShowAppealModal(false);
      setReviewNotes('');
      setReviewAction(null);
      setSelectedAppeal(null);
      
    } catch (err: any) {
      console.error('Error reviewing appeal:', err);
      setError(err.response?.data?.message || `Failed to ${reviewAction} appeal.`);
    } finally {
      setReviewLoading(false);
    }
  };
  
  // Table columns
  const columns = [
    {
      id: 'appealedBy',
      header: 'Appealed By',
      cell: (appeal: Appeal) => {
        const username = typeof appeal.appealedBy === 'object' && appeal.appealedBy?.username 
          ? appeal.appealedBy.username 
          : 'Unknown';
        return username;
      },
      sortable: false,
    },
    {
      id: 'ban',
      header: 'Ban ID',
      cell: (appeal: Appeal) => {
        const banId = typeof appeal.ban === 'object' && appeal.ban?._id 
          ? appeal.ban._id 
          : (typeof appeal.ban === 'string' ? appeal.ban : 'Unknown');
        return (
          <span className="font-mono text-xs">
            {banId.substring(0, 8)}...
          </span>
        );
      },
      sortable: false,
    },
    {
      id: 'reason',
      header: 'Reason',
      cell: (appeal: Appeal) => (
        <div className="max-w-xs truncate" title={appeal.reason}>
          {appeal.reason}
        </div>
      ),
      sortable: false,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (appeal: Appeal) => <StatusBadge status={appeal.status} />,
      sortable: true,
    },
    {
      id: 'createdAt',
      header: 'Submitted',
      cell: (appeal: Appeal) => formatDate(appeal.createdAt),
      sortable: true,
    },
    {
      id: 'updatedAt',
      header: 'Last Updated',
      cell: (appeal: Appeal) => formatDate(appeal.updatedAt),
      sortable: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (appeal: Appeal) => {
        if (appeal.status === AppealStatus.PENDING) {
          return (
            <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApproveAppeal(appeal)}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRejectAppeal(appeal)}
              >
                Reject
              </Button>
            </div>
          );
        }
        return (
          <div className="text-gray-500 text-sm">
            {appeal.status === AppealStatus.APPROVED ? 'Approved' : 'Rejected'}
          </div>
        );
      },
      sortable: false,
    },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Appeals</h1>
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
            <AppealFilter 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : appeals.length === 0 ? (
            <div className="bg-gray-50 py-10 px-4 text-center rounded-md">
              <p className="text-gray-600">No appeals found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  data={appeals}
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
                  totalPages={Math.ceil(totalAppeals / (filters.limit || 10))}
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
      
      {/* Appeal Details Modal */}
      <Modal
        isOpen={showAppealModal}
        onClose={() => setShowAppealModal(false)}
        title="Appeal Details"
        size="lg"
      >
        {selectedAppeal && (
          <AppealDetails
            appeal={selectedAppeal}
            onApprove={() => {
              setShowAppealModal(false);
              setTimeout(() => handleApproveAppeal(selectedAppeal), 300);
            }}
            onReject={() => {
              setShowAppealModal(false);
              setTimeout(() => handleRejectAppeal(selectedAppeal), 300);
            }}
          />
        )}
      </Modal>
      
      {/* Appeal Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={`${reviewAction === 'approve' ? 'Approve' : 'Reject'} Appeal`}
      >
        <div className="p-4">
          <div className="mb-4">
            <label htmlFor="reviewNotes" className="block text-sm font-medium text-gray-700 mb-1">
              Review Notes
            </label>
            <textarea
              id="reviewNotes"
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your review notes (optional)"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowReviewModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant={reviewAction === 'approve' ? 'primary' : 'danger'}
              isLoading={reviewLoading}
              onClick={handleReviewSubmit}
            >
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Appeal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AppealListPage;