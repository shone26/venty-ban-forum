// src/components/bans/BanForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Ban } from '../../interfaces/Ban';
import { useAuth } from '../../context/AuthContext';
import { createBan } from '../../services/api';

const BanForm: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    playerId: '',
    playerName: '',
    reason: '',
    evidence: '',
    expiresAt: '',
    notes: '',
    isActive: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    if (!currentUser) {
      setError('You must be logged in to create a ban');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Prepare ban data
      const banData: Omit<Ban, '_id' | 'createdAt'> = {
        playerId: formData.playerId,
        playerName: formData.playerName,
        reason: formData.reason,
        evidence: formData.evidence || undefined,
        adminId: currentUser.uid,
        adminName: currentUser.displayName,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
        notes: formData.notes || undefined,
        isActive: formData.isActive
      };
      
      // Submit ban
      await createBan(banData);
      
      // Redirect to ban list
      navigate('/bans');
    } catch (err) {
      console.error('Error creating ban:', err);
      setError('Failed to create ban. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Ban</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="playerId">
              Player ID (Steam/Discord)
            </label>
            <input
              type="text"
              id="playerId"
              name="playerId"
              value={formData.playerId}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="playerName">
              Player Name
            </label>
            <input
              type="text"
              id="playerName"
              name="playerName"
              value={formData.playerName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="reason">
            Ban Reason
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="evidence">
            Evidence (URLs to screenshots/videos)
          </label>
          <input
            type="text"
            id="evidence"
            name="evidence"
            value={formData.evidence}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="https://imgur.com/example1, https://youtube.com/example2"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="expiresAt">
            Ban Expiration (Leave empty for permanent ban)
          </label>
          <input
            type="datetime-local"
            id="expiresAt"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
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
            value={formData.notes}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
          />
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-gray-700 font-bold">Ban is active</span>
          </label>
        </div>
        
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => navigate('/bans')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isSubmitting ? 'Creating...' : 'Create Ban'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BanForm;