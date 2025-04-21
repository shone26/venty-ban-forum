// src/components/bans/BanForm.tsx
import React, { useState, useEffect } from 'react';
import { Ban, BanDuration, CreateBanData, UpdateBanData } from '../../types';
import Button from '../common/Button';

interface BanFormProps {
  initialData?: Partial<Ban>;
  onSubmit: (data: CreateBanData | UpdateBanData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const BanForm: React.FC<BanFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<CreateBanData | UpdateBanData>({
    playerName: '',
    steamId: '',
    discordId: '',
    ipAddress: '',
    reason: '',
    evidence: '',
    durationType: BanDuration.TEMPORARY,
    durationDays: 7,
    notes: '',
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ...initialData,
    }));
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.playerName) newErrors.playerName = 'Player name is required';
    if (!formData.steamId) newErrors.steamId = 'Steam ID is required';
    if (!formData.reason) newErrors.reason = 'Reason is required';
    if (!formData.evidence) newErrors.evidence = 'Evidence is required';

    // SteamID format (basic validation)
    if (formData.steamId && !/^STEAM_[0-9]:[0-9]:[0-9]+$/.test(formData.steamId)) {
      newErrors.steamId = 'Invalid Steam ID format. Example: STEAM_0:1:12345678';
    }

    // Duration days required for temporary bans
    if (formData.durationType === BanDuration.TEMPORARY && !formData.durationDays) {
      newErrors.durationDays = 'Duration days is required for temporary bans';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700">
            Player Name *
          </label>
          <input
            type="text"
            id="playerName"
            name="playerName"
            value={formData.playerName}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
              errors.playerName ? 'border-red-300' : ''
            }`}
          />
          {errors.playerName && (
            <p className="mt-1 text-sm text-red-600">{errors.playerName}</p>
          )}
        </div>

        <div>
          <label htmlFor="steamId" className="block text-sm font-medium text-gray-700">
            Steam ID *
          </label>
          <input
            type="text"
            id="steamId"
            name="steamId"
            value={formData.steamId}
            onChange={handleChange}
            placeholder="STEAM_0:1:12345678"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
              errors.steamId ? 'border-red-300' : ''
            }`}
          />
          {errors.steamId && (
            <p className="mt-1 text-sm text-red-600">{errors.steamId}</p>
          )}
        </div>

        <div>
          <label htmlFor="discordId" className="block text-sm font-medium text-gray-700">
            Discord ID
          </label>
          <input
            type="text"
            id="discordId"
            name="discordId"
            value={formData.discordId}
            onChange={handleChange}
            placeholder="Optional"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700">
            IP Address
          </label>
          <input
            type="text"
            id="ipAddress"
            name="ipAddress"
            value={formData.ipAddress}
            onChange={handleChange}
            placeholder="Optional"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="durationType" className="block text-sm font-medium text-gray-700">
            Ban Type *
          </label>
          <select
            id="durationType"
            name="durationType"
            value={formData.durationType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value={BanDuration.TEMPORARY}>Temporary</option>
            <option value={BanDuration.PERMANENT}>Permanent</option>
          </select>
        </div>

        {formData.durationType === BanDuration.TEMPORARY && (
          <div>
            <label htmlFor="durationDays" className="block text-sm font-medium text-gray-700">
              Duration (days) *
            </label>
            <input
              type="number"
              id="durationDays"
              name="durationDays"
              value={formData.durationDays}
              onChange={handleChange}
              min="1"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                errors.durationDays ? 'border-red-300' : ''
              }`}
            />
            {errors.durationDays && (
              <p className="mt-1 text-sm text-red-600">{errors.durationDays}</p>
            )}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          Reason for Ban *
        </label>
        <textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows={3}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
            errors.reason ? 'border-red-300' : ''
          }`}
        />
        {errors.reason && (
          <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
        )}
      </div>

      <div>
        <label htmlFor="evidence" className="block text-sm font-medium text-gray-700">
          Evidence *
        </label>
        <textarea
          id="evidence"
          name="evidence"
          value={formData.evidence}
          onChange={handleChange}
          rows={5}
          placeholder="Provide detailed evidence supporting this ban. Include links, screenshots, or descriptions of actions."
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
            errors.evidence ? 'border-red-300' : ''
          }`}
        />
        {errors.evidence && (
          <p className="mt-1 text-sm text-red-600">{errors.evidence}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Admin Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Optional notes for admin reference"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
        >
          {initialData._id ? 'Update Ban' : 'Create Ban'}
        </Button>
      </div>
    </form>
  );
};

export default BanForm;