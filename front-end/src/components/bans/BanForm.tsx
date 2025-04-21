// src/components/bans/BanForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ban, BanDuration, BanStatus } from '../../types';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { PhotoUpload } from '../ui/PhotoUpload';
import { bansApi } from '../../services/api';

interface BanFormProps {
  initialValues?: Partial<Ban>;
  onSuccess?: (ban: Ban) => void;
  isEdit?: boolean;
}

export const BanForm: React.FC<BanFormProps> = ({
  initialValues = {},
  onSuccess,
  isEdit = false,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Ban>>({
    playerName: '',
    steamId: '',
    discordId: '',
    ipAddress: '',
    reason: '',
    evidence: '',
    durationType: BanDuration.TEMPORARY,
    durationDays: 30,
    notes: '',
    ...initialValues,
  });
  
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>(
    initialValues.evidencePhotos || []
  );
  const [removedPhotos, setRemovedPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRemoveExistingPhoto = (url: string) => {
    setExistingPhotos(prev => prev.filter(photo => photo !== url));
    setRemovedPhotos(prev => [...prev, url]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        evidencePhotos: evidenceFiles,
        removedPhotos, // Let the backend know which photos were removed
      };

      let response;
      if (isEdit && initialValues._id) {
        response = await bansApi.updateBan(initialValues._id, submitData);
      } else {
        response = await bansApi.createBan(submitData);
      }

      if (onSuccess) {
        onSuccess(response);
      } else {
        navigate(`/bans/${response._id}`);
      }
    } catch (err: any) {
      console.error('Error submitting ban:', err);
      setError(err.response?.data?.message || 'Failed to submit ban. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert 
          variant="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4 text-gray-900">Player Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
              Player Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="playerName"
              name="playerName"
              value={formData.playerName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="steamId" className="block text-sm font-medium text-gray-700 mb-1">
              Steam ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="steamId"
              name="steamId"
              value={formData.steamId}
              onChange={handleChange}
              required
              placeholder="e.g. 76561198123456789"
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="discordId" className="block text-sm font-medium text-gray-700 mb-1">
              Discord ID
            </label>
            <input
              type="text"
              id="discordId"
              name="discordId"
              value={formData.discordId || ''}
              onChange={handleChange}
              placeholder="e.g. username#1234"
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700 mb-1">
              IP Address
            </label>
            <input
              type="text"
              id="ipAddress"
              name="ipAddress"
              value={formData.ipAddress || ''}
              onChange={handleChange}
              placeholder="e.g. 192.168.1.1"
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">Only admins and moderators can see this information</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4 text-gray-900">Ban Details</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="durationType" className="block text-sm font-medium text-gray-700 mb-1">
                Ban Type <span className="text-red-500">*</span>
              </label>
              <select
                id="durationType"
                name="durationType"
                value={formData.durationType}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={BanDuration.TEMPORARY}>Temporary</option>
                <option value={BanDuration.PERMANENT}>Permanent</option>
              </select>
            </div>
            
            {formData.durationType === BanDuration.TEMPORARY && (
              <div>
                <label htmlFor="durationDays" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (Days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="durationDays"
                  name="durationDays"
                  value={formData.durationDays || ''}
                  onChange={handleChange}
                  min="1"
                  max="365"
                  required={formData.durationType === BanDuration.TEMPORARY}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Ban <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-1">
              Text Evidence <span className="text-red-500">*</span>
            </label>
            <textarea
              id="evidence"
              name="evidence"
              value={formData.evidence}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Describe the evidence for this ban (timestamps, chat logs, etc.)"
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo Evidence
            </label>
            <PhotoUpload
              onChange={setEvidenceFiles}
              value={evidenceFiles}
              existingPhotos={existingPhotos}
              onRemoveExisting={handleRemoveExistingPhoto}
              multiple={true}
              maxFiles={5}
            />
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Admin Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={3}
              placeholder="Private notes visible only to admins and moderators"
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      {isEdit && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4 text-gray-900">Ban Status</h3>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Current Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={BanStatus.ACTIVE}>Active</option>
              <option value={BanStatus.EXPIRED}>Expired</option>
              <option value={BanStatus.APPEALED}>Appealed</option>
              <option value={BanStatus.REVOKED}>Revoked</option>
            </select>
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/bans')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {isEdit ? 'Update Ban' : 'Create Ban'}
        </Button>
      </div>
    </form>
  );
};