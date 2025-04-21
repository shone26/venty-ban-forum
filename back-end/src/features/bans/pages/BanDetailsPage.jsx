// src/features/bans/pages/BanDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Spinner } from '../../../components/common/Spinner';
import { Modal } from '../../../components/common/Modal';
import { BanDetailsPanel } from '../../../components/bans/BanDetailsPanel';
import { BanStatusBadge } from '../components/BanStatusBadge';
import { AppealForm } from '../../../components/bans/AppealForm';
import { BanComments } from '../components/BanComments';
import { BanHistory } from '../../../components/bans/BanHistory';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/useToast';
import { formatDate } from '../../../utils/formatters';

const BanDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [ban, setBan] = useState(null);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchBanDetails();
  }, [id]);

  const fetchBanDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bans/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch ban details');
      }
      
      const data = await response.json();
      setBan(data);
      if (data.status) {
        setUpdatedStatus(data.status);
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
      const response = await fetch(`/api/bans/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete ban');
      }
      
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
      const response = await fetch(`/api/bans/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: updatedStatus
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update ban status');
      }
      
      const updatedBan = await response.json();
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

  const handleAppealSubmit = async (appealData) => {
    try {
      const response = await fetch('/api/appeals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...appealData,
          ban: id
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit appeal');
      }
      
      showToast('success', 'Appeal submitted successfully');
      setShowAppealModal(false);
      fetchBanDetails();
    } catch (error) {
      console.error('Error submitting appeal:', error);
      showToast('error', 'Failed to submit appeal');
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

  const canAppeal = ban.status === 'active' && !ban.appeals?.some(appeal => appeal.status === 'pending');
  const isExpired = ban.durationType === 'temporary' && new Date(ban.expiresAt) < new Date();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Ban Details</h1>
          <div className="flex items-center mt-2">
            <BanStatusBadge status={ban.status} />
            {isExpired && ban.status === 'active' && (
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
          
          {hasPermission(['admin', 'moderator']) && (
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
                  {ban.appeals.map(appeal => (
                    <div 
                      key={appeal._id} 
                      className="border rounded p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">
                            Appeal by {appeal.appealedBy.username}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(appeal.createdAt)}
                          </p>
                        </div>
                        <span className={`
                          inline-flex rounded-full px-2 py-1 text-xs font-medium
                          ${appeal.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            appeal.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-amber-100 text-amber-800'}
                        `}>
                          {appeal.status.charAt(0).toUpperCase() + appeal.status.slice(1)}
                        </span>
                      </div>
                      <p className="mb-2">{appeal.reason}</p>
                      <div className="border-t pt-2 mt-2">
                        <p className="text-sm font-medium">Evidence:</p>
                        <p className="text-sm">{appeal.evidence}</p>
                      </div>
                      
                      {appeal.reviewedBy && (
                        <div className="border-t pt-2 mt-2">
                          <p className="text-sm font-medium">
                            Reviewed by {appeal.reviewedBy.username} on {formatDate(appeal.updatedAt)}
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
          
          <BanComments banId={id} />
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
                {ban.ipAddress && hasPermission(['admin', 'moderator']) && (
                  <div>
                    <p className="text-sm text-gray-500">IP Address</p>
                    <p className="font-medium font-mono">{ban.ipAddress}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
          
          <BanHistory steamId={ban.steamId} currentBanId={id} className="mt-6" />
        </div>
      </div>
      
      {/* Appeal Modal */}
      <Modal
        title="Submit Appeal"
        isOpen={showAppealModal}
        onClose={() => setShowAppealModal(false)}
      >
        <AppealForm 
          onSubmit={handleAppealSubmit} 
          onCancel={() => setShowAppealModal(false)}
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
              onChange={(e) => setUpdatedStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="appealed">Appealed</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowUpdateModal(false)}
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