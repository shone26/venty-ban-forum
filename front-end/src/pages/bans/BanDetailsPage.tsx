// src/pages/bans/BanDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Ban, BanStatus, Appeal } from '../../types';
import { bansApi, appealsApi } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Alert } from '../../components/ui/Alert';
import { BanDetails } from '../../components/bans/BanDetails';
import { AppealForm } from '../../components/appeals/AppealForm';
import { AppealDetails } from '../../components/appeals/AppealDetails';
import { StatusBadge } from '../../components/ui/StatusBadge';

const BanDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [ban, setBan] = useState<Ban | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<BanStatus | ''>('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [appealStatus, setAppealStatus] = useState<string | null>(null);
  const [appealId, setAppealId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  
  // Fetch ban details
  useEffect(() => {
    const fetchBan = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await bansApi.getBanById(id);
        setBan(data);
        if (data.status) {
          setSelectedStatus(data.status);
        }
      } catch (err: any) {
        console.error('Error fetching ban:', err);
        setError(err.response?.data?.message || 'Failed to fetch ban details.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBan();
  }, [id]);
  
  // Handle appeal submission
  const handleAppealSubmit = async (appeal: Appeal) => {
    try {
      await fetchBan();
      setShowAppealModal(false);
    } catch (err) {
      console.error('Error refreshing ban data:', err);
    }
  };
  
  // Handle ban deletion
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setDeleteLoading(true);
      await bansApi.deleteBan(id);
      navigate('/bans');
    } catch (err: any) {
      console.error('Error deleting ban:', err);
      setError(err.response?.data?.message || 'Failed to delete ban.');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };
  
  // Handle status update
  const handleStatusUpdate = async () => {
    if (!id || !selectedStatus) return;
    
    try {
      setStatusUpdateLoading(true);
      const updatedBan = await bansApi.updateBan(id, { status: selectedStatus });
      setBan(updatedBan);
    } catch (err: any) {
      console.error('Error updating ban status:', err);
      setError(err.response?.data?.message || 'Failed to update ban status.');
    } finally {
      setStatusUpdateLoading(false);
      setShowStatusModal(false);
    }
  };
  
  // Handle appeal review (approve/reject)
  const handleReviewSubmit = async () => {
    if (!appealId || !appealStatus) return;
    
    try {
      setReviewLoading(true);
      await appealsApi.updateAppeal(appealId, {
        status: appealStatus as any,
        reviewNotes,
      });
      
      // If approved, also update the ban status
      if (appealStatus === 'approved' && id) {
        await bansApi.updateBan(id, { status: BanStatus.APPEALED });
      }
      
      // Refresh the ban data to get updated appeals
      await fetchBan();
    } catch (err: any) {
      console.error('Error reviewing appeal:', err);
      setError(err.response?.data?.message || 'Failed to review appeal.');
    } finally {
      setReviewLoading(false);
      setShowReviewModal(false);
      setAppealStatus(null);
      setAppealId(null);
      setReviewNotes('');
    }
  };
  
  // Fetch the ban data again
  const fetchBan = async () => {
    if (!id) return;
    
    try {
      const data = await bansApi.getBanById(id);
      setBan(data);
      return data;
    } catch (err: any) {
      console.error('Error fetching ban:', err);
      setError(err.response?.data?.message || 'Failed to fetch ban details.');
      throw err;
    }
  };
  
  // Handle appeal actions
  const handleApproveAppeal = (appealId: string) => {
    setAppealId(appealId);
    setAppealStatus('approved');
    setShowReviewModal(true);
  };
  
  const handleRejectAppeal = (appealId: string) => {
    setAppealId(appealId);
    setAppealStatus('rejected');
    setShowReviewModal(true);
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Error state
  if (error || !ban) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert
          variant="error"
          title="Error"
          message={error || 'Ban not found'}
        />
        <div className="mt-4">
          <Button
            variant="primary"
            onClick={() => navigate('/bans')}
          >
            Back to Bans
          </Button>
        </div>
      </div>
    );
  }
  
  // Success state - render ban details
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ban Details</h1>
        <Button
          variant="outline"
          onClick={() => navigate('/bans')}
        >
          Back to List
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
      
      <BanDetails
        ban={ban}
        onAppeal={() => setShowAppealModal(true)}
        onEdit={() => navigate(`/bans/edit/${id}`)}
        onDelete={() => setShowDeleteModal(true)}
        onUpdateStatus={() => setShowStatusModal(true)}
      />
      
      {/* Appeals Section */}
      {ban.appeals && ban.appeals.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Appeals</h2>
          <div className="space-y-6">
            {ban.appeals.map((appeal) => (
              <AppealDetails
                key={appeal._id}
                appeal={appeal}
                onApprove={() => handleApproveAppeal(appeal._id)}
                onReject={() => handleRejectAppeal(appeal._id)}
                onDelete={() => {
                  // TODO: Implement delete functionality
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Appeal Modal */}
      <Modal
        isOpen={showAppealModal}
        onClose={() => setShowAppealModal(false)}
        title="Submit Appeal"
        size="lg"
      >
        <AppealForm
          banId={id || ''}
          onSuccess={handleAppealSubmit}
          onCancel={() => setShowAppealModal(false)}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Ban"
      >
        <div className="p-4">
          <p className="mb-4">Are you sure you want to delete this ban? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={deleteLoading}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Ban Status"
      >
        <div className="p-4">
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as BanStatus)}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select status</option>
              {Object.values(BanStatus).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowStatusModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={statusUpdateLoading}
              onClick={handleStatusUpdate}
              disabled={!selectedStatus}
            >
              Update
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Appeal Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={`${appealStatus === 'approved' ? 'Approve' : 'Reject'} Appeal`}
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
              variant={appealStatus === 'approved' ? 'primary' : 'danger'}
              isLoading={reviewLoading}
              onClick={handleReviewSubmit}
            >
              {appealStatus === 'approved' ? 'Approve' : 'Reject'} Appeal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BanDetailsPage;