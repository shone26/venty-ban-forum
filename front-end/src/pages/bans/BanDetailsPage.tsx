// src/pages/bans/BanDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { Ban } from '../../interfaces/Ban';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../context/AuthContext';
import { deleteBan, getBanById, updateBan } from '../../services/api';

const BanDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [ban, setBan] = useState<Ban | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editForm, setEditForm] = useState({
    reason: '',
    evidence: '',
    notes: '',
    expiresAt: '',
    isActive: true
  });
  
  useEffect(() => {
    if (!id) return;
    
    const fetchBan = async () => {
      try {
        setLoading(true);
        const data = await getBanById(id);
        setBan(data);
        
        // Initialize form data
        setEditForm({
          reason: data.reason,
          evidence: data.evidence || '',
          notes: data.notes || '',
          expiresAt: data.expiresAt 
            ? new Date(data.expiresAt).toISOString().slice(0, 16) 
            : '',
          isActive: data.isActive
        });
      } catch (err) {
        console.error('Error fetching ban details:', err);
        setError('Failed to load ban details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBan();
  }, [id]);
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !ban) return;
    
    try {
      const updateData: Partial<Ban> = {
        reason: editForm.reason,
        evidence: editForm.evidence || undefined,
        notes: editForm.notes || undefined,
        expiresAt: editForm.expiresAt ? new Date(editForm.expiresAt) : undefined,
        isActive: editForm.isActive
      };
      
      const updatedBan = await updateBan(id, updateData);
      setBan(updatedBan);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating ban:', err);
      setError('Failed to update ban');
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteBan(id);
      navigate('/bans');
    } catch (err) {
      console.error('Error deleting ban:', err);
      setError('Failed to delete ban');
    }
  };
  
  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Permanent';
    return new Date(date).toLocaleString();
  };
  
  // Determine if the current user can edit this ban
  const canEdit = () => {
    if (!currentUser || !ban) return false;
    return currentUser.role === 'admin' || currentUser.uid === ban.adminId;
  };
  
  // Determine if the current user can delete this ban
  const canDelete = () => {
    if (!currentUser) return false;
    return currentUser.role === 'admin';
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error}</p>
        <Link to="/bans" className="text-red-700 font-bold hover:underline">
          Return to ban list
        </Link>
      </div>
    );
  }
  
  if (!ban) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Ban not found</h3>
        <Link to="/bans" className="text-blue-600 hover:text-blue-800">
          Return to ban list
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Ban Details</h1>
        
        <div className="flex space-x-2">
          <Link to="/bans">
            <Button variant="secondary">Back to List</Button>
          </Link>
          
          {canEdit() && !isEditing && (
            <Button 
              variant="primary" 
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
          
          {canDelete() && (
            <Button 
              variant="danger" 
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
      
      {/* Ban details card */}
      <Card className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{ban.playerName}</h2>
            <p className="text-gray-600">ID: {ban.playerId}</p>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            !ban.isActive 
              ? 'bg-gray-200 text-gray-800' 
              : !ban.expiresAt 
                ? 'bg-red-100 text-red-800' 
                : new Date(ban.expiresAt) < new Date()
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
          }`}>
            {!ban.isActive 
              ? 'Inactive' 
              : !ban.expiresAt 
                ? 'Permanent' 
                : new Date(ban.expiresAt) < new Date()
                  ? 'Expired'
                  : 'Active'}
          </div>
        </div>
        
        {isEditing ? (
          // Edit form
          <form onSubmit={handleEditSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="reason">
                Ban Reason
              </label>
              <textarea
                id="reason"
                name="reason"
                value={editForm.reason}
                onChange={handleEditChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="evidence">
                Evidence
              </label>
              <input
                type="text"
                id="evidence"
                name="evidence"
                value={editForm.evidence}
                onChange={handleEditChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="URLs to screenshots/videos"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="expiresAt">
                Ban Expiration (Leave empty for permanent)
              </label>
              <input
                type="datetime-local"
                id="expiresAt"
                name="expiresAt"
                value={editForm.expiresAt}
                onChange={handleEditChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="notes">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={editForm.notes}
                onChange={handleEditChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
              />
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={editForm.isActive}
                  onChange={handleEditChange}
                  className="mr-2"
                />
                <span className="text-gray-700 font-bold">Ban is active</span>
              </label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          // View mode
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Ban Reason</h3>
              <p className="text-gray-700 whitespace-pre-line">{ban.reason}</p>
            </div>
            
            {ban.evidence && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Evidence</h3>
                <div className="text-blue-600 break-words">
                  {ban.evidence.split(',').map((url, index) => (
                    <a 
                      key={index}
                      href={url.trim()} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block hover:underline mb-1"
                    >
                      {url.trim()}
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {ban.notes && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Additional Notes</h3>
                <p className="text-gray-700 whitespace-pre-line">{ban.notes}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
              <div>
                <p><span className="font-bold">Created By:</span> {ban.adminName}</p>
                <p><span className="font-bold">Created At:</span> {formatDate(ban.createdAt)}</p>
              </div>
              <div>
                <p><span className="font-bold">Expires At:</span> {formatDate(ban.expiresAt)}</p>
                <p><span className="font-bold">Status:</span> {
                  !ban.isActive 
                    ? 'Inactive' 
                    : !ban.expiresAt 
                      ? 'Permanent' 
                      : new Date(ban.expiresAt) < new Date()
                        ? 'Expired'
                        : 'Active'
                }</p>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      {/* Delete confirmation modal */}
      <Modal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Confirm Delete"
      >
        <div>
          <p className="mb-4">Are you sure you want to delete this ban record for <strong>{ban.playerName}</strong>?</p>
          <p className="mb-6 text-red-600">This action cannot be undone.</p>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BanDetailsPage;