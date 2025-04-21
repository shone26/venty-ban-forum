// src/pages/bans/BanDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import BanDetailsPanel from '../../components/bans/BanDetailsPanel';
import BanStatusBadge from '../../components/bans/BanStatusBadge';
import AppealForm from '../../components/appeals/AppealForm';
import AppealStatusBadge from '../../components/appeals/AppealStatusBadge';
import { getBanById, updateBan, deleteBan } from '../../api/bans';

import { Ban, BanStatus, Appeal, CreateAppealData, AppealStatus } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { createAppeal } from '../../api/apeals';
import { useToast } from '../../components/common/ToastContext';


const BanDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, hasPermission } = useAuth();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [ban, setBan] = useState<Ban | null>(null);
  const [showAppealModal, setShowAppealModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [updatedStatus, setUpdatedStatus] = useState<BanStatus>(BanStatus.ACTIVE);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [appealLoading, setAppealLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchBanDetails();
    }
  }, [id]);

  const fetchBanDetails = async () => {
    try {
      setLoading(true);
      
      if (!id) return;
      
      const data = await getBanById(id);
      setBan(data);
      
      if (data.status) {
        setUpdatedStatus(data.status as BanStatus);
      }
    } catch (error) {
      console.error('Error fetching ban details:', error);
      showToast('error', 'Failed to load ban details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      
      if (!id) return;
      
      await deleteBan(id);
      showToast('success', 'Ban deleted successfully');
      navigate('/bans');
    } catch (error) {
      console.error('Error deleting ban:', error);
      showToast('error', 'Failed to delete ban');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setUpdateLoading(true);
      
      if (!id) return;
      
      const updatedBan = await updateBan(id, { status: updatedStatus });
      setBan(updatedBan);
      showToast('success', 'Ban status updated successfully');
    } catch (error) {
      console.error('Error updating ban status:', error);
      showToast('error', 'Failed to update ban status');
    } finally {
      setUpdateLoading(false);
      setShowUpdateModal(false);
    }
  };

  const handleAppealSubmit = async (appealData: CreateAppealData) => {
    try {
      setAppealLoading(true);
      
      if (!id) return;
      
      await createAppeal({
        ...appealData,
        ban: id,
      });
      
      showToast('success', 'Appeal submitted successfully');
      setShowAppealModal(false);
      fetchBanDetails();
    } catch (error) {
      console.error('Error submitting appeal:', error);
      showToast('error', 'Failed to submit appeal');
    } finally {
      setAppealLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPp');
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

  if (!ban) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-2">Ban Not Found</h2>
        <p className="mb-4">The ban you're looking for doesn't exist or has been removed.</p>
        <Button 
          variant="primary" 
          onClick={() => navigate('/bans')}
        >
          Back to Ban List
        </Button>
      </div>
    );
  }

  const canAppeal = isAuthenticated && 
                    ban.status === BanStatus.ACTIVE && 
                    !ban.appeals?.some(appeal => 
                      appeal.status === AppealStatus.PENDING
                    );
                    
  const isExpired = ban.durationType === 'temporary' && 
                    ban.expiresAt && 
                    new Date(ban.expiresAt) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Ban Details</h1>
          <div className="flex items-center mt-2">
            <BanStatusBadge status={ban.status} />
            {isExpired && ban.status === BanStatus.ACTIVE && (
              <span className="ml-2 text-amber-500 text-sm font-medium">
                (Expired but not processed)
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          {canAppeal && (
            <Button 
              variant="secondary" 
              onClick={() => setShowAppealModal(true)}
            >
              Submit Appeal
            </Button>
          )}
          
          {isAuthenticated && hasPermission(['admin', 'moderator']) && (
            <>
              <Button 
                variant="secondary" 
                onClick={() => setShowUpdateModal(true)}
              >
                Update Status
              </Button>
              
              {hasPermission(['admin']) && (
                <Button 
                  variant="danger" 
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </Button>
              )}
            </>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/bans')}
          >
            Back to List
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <BanDetailsPanel ban={ban} />
          
          {ban.appeals && ban.appeals.length > 0 && (
            <Card className="mt-6">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Appeals</h2>
                <div className="space-y-4">
                  {ban.appeals.map((appeal: Appeal) => (
                    <div 
                      key={appeal._id} 
                      className="border rounded p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">
                            Appeal by {typeof appeal.appealedBy === 'object' 
                              ? appeal.appealedBy.username 
                              : 'Unknown'
                            }
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(appeal.createdAt)}
                          </p>
                        </div>
                        <AppealStatusBadge status={appeal.status} />
                      </div>
                      <p className="mb-2">{appeal.reason}</p>
                      <div className="border-t pt-2 mt-2">
                        <p className="text-sm font-medium">Evidence:</p>
                        <p className="text-sm">{appeal.evidence}</p>
                      </div>
                      
                      {appeal.reviewedBy && (
                        <div className="border-t pt-2 mt-2">
                          <p className="text-sm font-medium">
                            Reviewed by {typeof appeal.reviewedBy === 'object' 
                              ? appeal.reviewedBy.username 
                              : 'Unknown'
                            } on {formatDate(appeal.updatedAt)}
                          </p>
                          {appeal.reviewNotes && (
                            <p className="text-sm">{appeal.reviewNotes}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
        
        <div className="col-span-1">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Player Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Player Name</p>
                  <p className="font-medium">{ban.playerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Steam ID</p>
                  <p className="font-medium font-mono">{ban.steamId}</p>
                </div>
                {ban.discordId && (
                  <div>
                    <p className="text-sm text-gray-500">Discord ID</p>
                    <p className="font-medium font-mono">{ban.discordId}</p>
                  </div>
                )}
                {ban.ipAddress && isAuthenticated && hasPermission(['admin', 'moderator']) && (
                  <div>
                    <p className="text-sm text-gray-500">IP Address</p>
                    <p className="font-medium font-mono">{ban.ipAddress}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Appeal Modal */}
      <Modal
        title="Submit Appeal"
        isOpen={showAppealModal}
        onClose={() => setShowAppealModal(false)}
      >
        <AppealForm 
          banId={id} 
          onSubmit={handleAppealSubmit} 
          onCancel={() => setShowAppealModal(false)}
          isSubmitting={appealLoading}
        />
      </Modal>
      
      {/* Update Status Modal */}
      <Modal
        title="Update Ban Status"
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              className="w-full p-2 border rounded"
              value={updatedStatus}
              onChange={(e) => setUpdatedStatus(e.target.value as BanStatus)}
            >
              <option value={BanStatus.ACTIVE}>Active</option>
              <option value={BanStatus.EXPIRED}>Expired</option>
              <option value={BanStatus.APPEALED}>Appealed</option>
              <option value={BanStatus.REVOKED}>Revoked</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowUpdateModal(false)}
              disabled={updateLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleStatusUpdate}
              loading={updateLoading}
            >
              Update Status
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Ban"
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="p-4">
          <p>Are you sure you want to delete this ban? This action cannot be undone.</p>
          
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
              Delete Ban
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BanDetailsPage;