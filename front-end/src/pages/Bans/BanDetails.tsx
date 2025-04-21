import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Ban, AppealStatus, BanStatus } from '../../api/types';
import BanApi from '../../api/bans';
import AppealApi from '../../api/appeals';

import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

import { Spinner } from '../../components/common/Spinner';
import { BanDetailsPanel } from '../../components/bans/BanDetailsPanel';
import { BanHistory } from '../../components/bans/BanHistory';
import { AppealForm } from '../../components/bans/AppealForm';
import { EvidenceGallery } from '../../components/bans/EvidenceGallery';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../context/ToastContext';
import { Modal } from '@/components/common/Modals';

const BanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // State
  const [ban, setBan] = useState<Ban | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  
  // Update ban status state
  const [updatedStatus, setUpdatedStatus] = useState<BanStatus>(BanStatus.ACTIVE);
  
  // Loading states for actions
  const [appealSubmitting, setAppealSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [updateSubmitting, setUpdateSubmitting] = useState(false);
  
  // Fetch ban details
  useEffect(() => {
    const fetchBanDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const banData = await BanApi.getBanById(id);
        setBan(banData);
        
        // Initialize updated status
        if (banData?.status) {
          setUpdatedStatus(banData.status as BanStatus);
        }
      } catch (err) {
        console.error('Error fetching ban details:', err);
        setError('Failed to load ban details');
        showToast('error', 'Failed to load ban details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBanDetails();
  }, [id]);
  
  // Handle submit appeal
  const handleSubmitAppeal = async (appealData: { reason: string; evidence: string }) => {
    if (!id) return;
    
    try {
      setAppealSubmitting(true);
      
      await AppealApi.createAppeal({
        ban: id,
        reason: appealData.reason,
        evidence: appealData.evidence,
      });
      
      showToast('success', 'Appeal submitted successfully');
      setShowAppealModal(false);
      
      // Refresh ban details to update appeals list
      const updatedBan = await BanApi.getBanById(id);
      setBan(updatedBan);
    } catch (err) {
      console.error('Error submitting appeal:', err);
      showToast('error', 'Failed to submit appeal');
    } finally {
      setAppealSubmitting(false);
    }
  };
  
  // Handle delete ban
  const handleDeleteBan = async () => {
    if (!id) return;
    
    try {
      setDeleteSubmitting(true);
      
      await BanApi.deleteBan(id);
      
      showToast('success', 'Ban deleted successfully');
      navigate('/bans');
    } catch (err) {
      console.error('Error deleting ban:', err);
      showToast('error', 'Failed to delete ban');
    } finally {
      setDeleteSubmitting(false);
      setShowDeleteModal(false);
    }
  };
  
  // Handle update ban status
  const handleUpdateStatus = async () => {
    if (!id) return;
    
    try {
      setUpdateSubmitting(true);
      
      const updatedBan = await BanApi.updateBan(id, {
        status: updatedStatus,
      });
      
      setBan(updatedBan);
      showToast('success', 'Ban status updated successfully');
    } catch (err) {
      console.error('Error updating ban status:', err);
      showToast('error', 'Failed to update ban status');
    } finally {
      setUpdateSubmitting(false);
      setShowUpdateModal(false);
    }
  };
  
  // Check if player can appeal the ban
  const canAppeal = () => {
    if (!ban) return false;
    
    // Can only appeal active bans
    if (ban.status !== BanStatus.ACTIVE) return false;
    
    // Check if there's already a pending appeal
    if (Array.isArray(ban.appeals)) {
      const hasPendingAppeal = ban.appeals.some(
        appeal => typeof appeal === 'object' && appeal.status === AppealStatus.PENDING
      );
      return !hasPendingAppeal;
    }
    
    return true;
  };
  
  // Loading state
  if (loading) {
    return (
      
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      
    );
  }
  
  // Error state
  if (error || !ban) {
    return (
      
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Ban not found'}
          </h2>
          <p className="text-gray-500 mb-6">
            The ban you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Button variant="primary" onClick={() => navigate('/bans')}>
            Back to Ban List
          </Button>
        </div>
      
    );
  }
  
  // Check if ban is expired but still active
  const isExpired = ban.durationType === 'temporary' && 
    ban.expiresAt && 
    new Date(ban.expiresAt) < new Date() && 
    ban.status === BanStatus.ACTIVE;
  
  return (
    <div>
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ban Details</h1>
            <p className="text-gray-500">
              Player: <span className="font-medium">{ban.playerName}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {canAppeal() && (
              <Button 
                variant="secondary" 
                onClick={() => setShowAppealModal(true)}
              >
                Submit Appeal
              </Button>
            )}
            
            <Button 
              variant="secondary" 
              onClick={() => setShowUpdateModal(true)}
            >
              Update Status
            </Button>
            
            <Button 
              variant="danger" 
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/bans')}
            >
              Back to List
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ban details */}
            <BanDetailsPanel ban={ban} />
            
            {/* Evidence gallery */}
            {ban.evidencePaths && ban.evidencePaths.length > 0 && (
              <Card>
                <div className="p-6">
                  <EvidenceGallery evidencePaths={ban.evidencePaths} />
                </div>
              </Card>
            )}
            
            {/* Appeals section */}
            {Array.isArray(ban.appeals) && ban.appeals.length > 0 && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Appeals</h2>
                  <div className="space-y-4">
                    {ban.appeals.map((appeal) => (
                      <div 
                        key={typeof appeal === 'string' ? appeal : appeal._id} 
                        className="border rounded-md p-4"
                      >
                        {typeof appeal === 'object' ? (
                          <>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-medium">
                                  Appeal {formatDate(appeal.createdAt)}
                                </span>
                              </div>
                              <span className={`
                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${appeal.status === AppealStatus.APPROVED ? 'bg-green-100 text-green-800 border border-green-200' : 
                                  appeal.status === AppealStatus.REJECTED ? 'bg-red-100 text-red-800 border border-red-200' : 
                                  'bg-yellow-100 text-yellow-800 border border-yellow-200'}
                              `}>
                                {appeal.status.charAt(0).toUpperCase() + appeal.status.slice(1)}
                              </span>
                            </div>
                            
                            <h3 className="text-sm font-medium text-gray-500 mt-3 mb-1">Reason:</h3>
                            <p className="text-gray-900 mb-3">{appeal.reason}</p>
                            
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Evidence:</h3>
                            <p className="text-gray-900 whitespace-pre-line">{appeal.evidence}</p>
                            
                            {appeal.reviewNotes && (
                              <>
                                <h3 className="text-sm font-medium text-gray-500 mt-3 mb-1">Admin Response:</h3>
                                <p className="text-gray-900">{appeal.reviewNotes}</p>
                              </>
                            )}
                          </>
                        ) : (
                          <div className="text-gray-500">Appeal details not available</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Player info card */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium mb-4">Player Information</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Steam ID</label>
                    <div className="font-mono text-sm">{ban.steamId}</div>
                  </div>
                  
                  {ban.discordId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Discord ID</label>
                      <div className="font-mono text-sm">{ban.discordId}</div>
                    </div>
                  )}
                  
                  {ban.ipAddress && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">IP Address</label>
                      <div className="font-mono text-sm">{ban.ipAddress}</div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
            
            {/* Ban history */}
            <BanHistory 
              steamId={ban.steamId} 
              currentBanId={ban._id} 
            />
          </div>
        </div>
      </div>
      
      {/* Appeal Modal */}
      <Modal
        isOpen={showAppealModal}
        onClose={() => setShowAppealModal(false)}
        title="Submit Appeal"
        size="md"
      >
        <AppealForm
          banId={id}
          onSubmit={handleSubmitAppeal}
          onCancel={() => setShowAppealModal(false)}
          isSubmitting={appealSubmitting}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Ban"
        size="sm"
      >
        <div>
          <p className="mb-4">Are you sure you want to delete this ban? This action cannot be undone.</p>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteBan}
              loading={deleteSubmitting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Update Status Modal */}
      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Update Ban Status"
        size="sm"
      >
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={updatedStatus}
              onChange={(e) => setUpdatedStatus(e.target.value as BanStatus)}
            >
              <option value={BanStatus.ACTIVE}>Active</option>
              <option value={BanStatus.EXPIRED}>Expired</option>
              <option value={BanStatus.APPEALED}>Appealed</option>
              <option value={BanStatus.REVOKED}>Revoked</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowUpdateModal(false)}
              disabled={updateSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateStatus}
              loading={updateSubmitting}
            >
              Update
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BanDetails;