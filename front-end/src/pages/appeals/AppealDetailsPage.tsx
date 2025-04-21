// src/pages/appeals/AppealDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import AppealStatusBadge from '../../components/appeals/AppealStatusBadge';
import BanDetailsPanel from '../../components/bans/BanDetailsPanel';

import { updateBan } from '../../api/bans';
import { Appeal, AppealStatus, Ban, BanStatus } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/ToastContext';
import { deleteAppeal, getAppealById, updateAppeal } from '../../api/apeals';


const AppealDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [appeal, setAppeal] = useState<Appeal | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [reviewStatus, setReviewStatus] = useState<AppealStatus>(AppealStatus.APPROVED);
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [updateBanStatus, setUpdateBanStatus] = useState<boolean>(true);
  const [reviewLoading, setReviewLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchAppealDetails();
    }
  }, [id]);

  const fetchAppealDetails = async () => {
    try {
      setLoading(true);
      
      if (!id) return;
      
      const data = await getAppealById(id);
      setAppeal(data);
    } catch (error) {
      console.error('Error fetching appeal details:', error);
      showToast('error', 'Failed to load appeal details');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      setReviewLoading(true);
      
      if (!id || !appeal) return;
      
      // Update the appeal status
      const updatedAppeal = await updateAppeal(id, {
        status: reviewStatus,
        reviewNotes,
      });
      
      // If approved and user wants to update ban status, update the ban as well
      if (reviewStatus === AppealStatus.APPROVED && updateBanStatus && typeof appeal.ban === 'object') {
        await updateBan(appeal.ban._id, {
          status: BanStatus.APPEALED,
        });
      }
      
      setAppeal(updatedAppeal);
      showToast('success', `Appeal ${reviewStatus.toLowerCase()} successfully`);
      setShowReviewModal(false);
    } catch (error) {
      console.error('Error updating appeal:', error);
      showToast('error', 'Failed to update appeal');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      
      if (!id) return;
      
      await deleteAppeal(id);
      showToast('success', 'Appeal deleted successfully');
      navigate('/appeals');
    } catch (error) {
      console.error('Error deleting appeal:', error);
      showToast('error', 'Failed to delete appeal');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPpp');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!appeal) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-2">Appeal Not Found</h2>
        <p className="mb-4">The appeal you're looking for doesn't exist or has been removed.</p>
        <Button 
          variant="primary" 
          onClick={() => navigate('/appeals')}
        >
          Back to Appeals List
        </Button>
      </div>
    );
  }

  const isPending = appeal.status === AppealStatus.PENDING;
  const banDetails = typeof appeal.ban === 'object' ? appeal.ban : null;
  const appealedBy = typeof appeal.appealedBy === 'object' ? appeal.appealedBy : null;
  const reviewedBy = typeof appeal.reviewedBy === 'object' ? appeal.reviewedBy : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Appeal Details</h1>
          <div className="flex items-center mt-2">
            <AppealStatusBadge status={appeal.status} />
          </div>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          {isPending && hasPermission(['admin', 'moderator']) && (
            <Button 
              variant="primary" 
              onClick={() => setShowReviewModal(true)}
            >
              Review Appeal
            </Button>
          )}
          
          {hasPermission(['admin']) && (
            <Button 
              variant="danger" 
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/appeals')}
          >
            Back to List
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Appeal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Appealed By</h3>
                  <p className="font-medium">
                    {appealedBy?.username || 'Unknown User'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date Submitted</h3>
                  <p className="font-medium">
                    {formatDate(appeal.createdAt)}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <div className="mt-1">
                    <AppealStatusBadge status={appeal.status} />
                  </div>
                </div>
                
                {reviewedBy && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Reviewed By</h3>
                    <p className="font-medium">
                      {reviewedBy.username} on {formatDate(appeal.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Reason for Appeal</h3>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="whitespace-pre-line">{appeal.reason}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Evidence</h3>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="whitespace-pre-line">{appeal.evidence}</p>
                </div>
              </div>
              
              {appeal.reviewNotes && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Review Notes</h3>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="whitespace-pre-line">{appeal.reviewNotes}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          {banDetails && (
            <BanDetailsPanel ban={banDetails} />
          )}
        </div>
        
        <div className="col-span-1">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Appeal Timeline</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-3 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Appeal Submitted</p>
                    <p className="text-sm text-gray-500">{formatDate(appeal.createdAt)}</p>
                  </div>
                </div>
                
                {appeal.status !== AppealStatus.PENDING && appeal.updatedAt && (
                  <div className="flex">
                    <div className="mr-3 flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        appeal.status === AppealStatus.APPROVED 
                          ? 'bg-green-100' 
                          : 'bg-red-100'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                          appeal.status === AppealStatus.APPROVED 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`} viewBox="0 0 20 20" fill="currentColor">
                          {appeal.status === AppealStatus.APPROVED ? (
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          )}
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">
                        Appeal {appeal.status === AppealStatus.APPROVED ? 'Approved' : 'Rejected'}
                      </p>
                      <p className="text-sm text-gray-500">{formatDate(appeal.updatedAt)}</p>
                      {reviewedBy && (
                        <p className="text-sm text-gray-500">by {reviewedBy.username}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
          
          {banDetails && (
            <Card className="mt-6">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Ban Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Player Name</p>
                    <p className="font-medium">{banDetails.playerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ban Status</p>
                    <div className="mt-1">
                      <AppealStatusBadge status={banDetails.status} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ban Type</p>
                    <p className="font-medium">
                      {banDetails.durationType === 'permanent' ? 'Permanent' : 'Temporary'} Ban
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      {/* Review Modal */}
      <Modal
        title="Review Appeal"
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        size="lg"
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Status Decision *
            </label>
            <div className="flex gap-2">
              <Button
                variant={reviewStatus === AppealStatus.APPROVED ? 'primary' : 'outline'}
                onClick={() => setReviewStatus(AppealStatus.APPROVED)}
              >
                Approve
              </Button>
              <Button
                variant={reviewStatus === AppealStatus.REJECTED ? 'primary' : 'outline'}
                onClick={() => setReviewStatus(AppealStatus.REJECTED)}
              >
                Reject
              </Button>
            </div>
          </div>
          
          {reviewStatus === AppealStatus.APPROVED && banDetails && (
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={updateBanStatus}
                  onChange={() => setUpdateBanStatus(!updateBanStatus)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Also update ban status to "Appealed"
                </span>
              </label>
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="reviewNotes" className="block text-sm font-medium mb-1">
              Review Notes
            </label>
            <textarea
              id="reviewNotes"
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Add notes explaining your decision..."
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowReviewModal(false)}
              disabled={reviewLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleReviewSubmit}
              loading={reviewLoading}
            >
              Submit Review
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Appeal"
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="p-4">
          <p>Are you sure you want to delete this appeal? This action cannot be undone.</p>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleteLoading}
            >
              Delete Appeal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AppealDetailsPage;