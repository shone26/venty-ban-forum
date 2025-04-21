import React, { useState, useEffect } from 'react';
import { Ban, BanDuration, CreateBanDto } from '../../api/types';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

import { parseMediaPaths } from '../../services/imageService';
import { isValidDiscordId, isValidIpAddress, isValidSteamId, validateBanForm } from '../../utils/validator';

interface BanFormProps {
  initialData?: Partial<Ban>;
  onSubmit: (data: CreateBanDto) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export const BanForm: React.FC<BanFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  // Form data state
  const [formData, setFormData] = useState<Partial<CreateBanDto>>({
    playerName: '',
    steamId: '',
    discordId: '',
    ipAddress: '',
    reason: '',
    evidence: '',
    durationType: BanDuration.TEMPORARY,
    durationDays: 30,
    notes: '',
    evidencePaths: [],
  });
  
  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Evidence paths input state
  const [evidencePathsInput, setEvidencePathsInput] = useState('');
  
  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
      });
      
      // Set evidence paths input if provided
      if (initialData.evidencePaths) {
        setEvidencePathsInput(
          Array.isArray(initialData.evidencePaths)
            ? initialData.evidencePaths.join(', ')
            : initialData.evidencePaths
        );
      }
    }
  }, [initialData]);
  
  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle duration days as number
    if (name === 'durationDays') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched({
        ...touched,
        [name]: true,
      });
    }
    
    // Clear field-specific error when value changes
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  // Handle evidence paths input change
  const handleEvidencePathsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setEvidencePathsInput(inputValue);
    
    // Parse the input string into an array of URLs
    const parsedPaths = parseMediaPaths(inputValue);
    
    setFormData({
      ...formData,
      evidencePaths: parsedPaths,
    });
  };
  
  // Handle form field blur for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched({
      ...touched,
      [name]: true,
    });
    
    // Validate specific fields on blur
    validateField(name, value);
  };
  
  // Validate individual field
  const validateField = (name: string, value: string | number) => {
    let error = '';
    
    switch (name) {
      case 'playerName':
        if (!value) {
          error = 'Player name is required';
        }
        break;
      case 'steamId':
        if (!value) {
          error = 'Steam ID is required';
        } else if (!isValidSteamId(value as string)) {
          error = 'Invalid Steam ID format';
        }
        break;
      case 'discordId':
        if (value && !isValidDiscordId(value as string)) {
          error = 'Invalid Discord ID format';
        }
        break;
      case 'ipAddress':
        if (value && !isValidIpAddress(value as string)) {
          error = 'Invalid IP address format';
        }
        break;
      case 'reason':
        if (!value) {
          error = 'Reason is required';
        }
        break;
      case 'evidence':
        if (!value) {
          error = 'Evidence is required';
        }
        break;
      case 'durationDays':
        if (formData.durationType === BanDuration.TEMPORARY && (!value || (value as number) <= 0)) {
          error = 'Duration days must be a positive number for temporary bans';
        }
        break;
      default:
        break;
    }
    
    setErrors({
      ...errors,
      [name]: error,
    });
    
    return !error;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const { isValid, errors: validationErrors } = validateBanForm(formData);
    setErrors(validationErrors);
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // Submit if valid
    if (isValid) {
      // Ensure evidencePaths is properly processed
      const submissionData = {
        ...formData,
        evidencePaths: parseMediaPaths(evidencePathsInput),
      };
      
      onSubmit(submissionData as CreateBanDto);
    }
  };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-xl font-bold mb-6">
                    {initialData?._id ? 'Edit Ban' : 'Create New Ban'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Player Information Section */}
                    <div className="col-span-full">
                        <h3 className="text-lg font-medium mb-4">Player Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Player Name */}
                            <div>
                                <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Player Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="playerName"
                                    name="playerName"
                                    value={formData.playerName || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                    ${errors.playerName && touched.playerName ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.playerName && touched.playerName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.playerName}</p>
                                )}
                            </div>

                            {/* Steam ID */}
                            <div>
                                <label htmlFor="steamId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Steam ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="steamId"
                                    name="steamId"
                                    value={formData.steamId || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                    ${errors.steamId && touched.steamId ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="e.g., STEAM_0:1:12345678"
                                />
                                {errors.steamId && touched.steamId && (
                                    <p className="mt-1 text-sm text-red-500">{errors.steamId}</p>
                                )}
                            </div>

                            {/* Discord ID */}
                            <div>
                                <label htmlFor="discordId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Discord ID (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="discordId"
                                    name="discordId"
                                    value={formData.discordId || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                    ${errors.discordId && touched.discordId ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="e.g., 123456789012345678"
                                />
                                {errors.discordId && touched.discordId && (
                                    <p className="mt-1 text-sm text-red-500">{errors.discordId}</p>
                                )}
                            </div>

                            {/* IP Address */}
                            <div>
                                <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                    IP Address (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="ipAddress"
                                    name="ipAddress"
                                    value={formData.ipAddress || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                    ${errors.ipAddress && touched.ipAddress ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="e.g., 192.168.1.1"
                                />
                                {errors.ipAddress && touched.ipAddress && (
                                    <p className="mt-1 text-sm text-red-500">{errors.ipAddress}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Ban Details Section */}
                    <div className="col-span-full">
                        <h3 className="text-lg font-medium mb-4">Ban Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Ban Type */}
                            <div>
                                <label htmlFor="durationType" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ban Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="durationType"
                                    name="durationType"
                                    value={formData.durationType || BanDuration.TEMPORARY}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value={BanDuration.TEMPORARY}>Temporary</option>
                                    <option value={BanDuration.PERMANENT}>Permanent</option>
                                </select>
                            </div>

                            {/* Duration Days (for temporary bans) */}
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
                                        onBlur={handleBlur}
                                        min="1"
                                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors.durationDays && touched.durationDays ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.durationDays && touched.durationDays && (
                                        <p className="mt-1 text-sm text-red-500">{errors.durationDays}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reason for Ban */}
                    <div className="col-span-full">
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                            Reason for Ban <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="reason"
                            name="reason"
                            value={formData.reason || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={3}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                ${errors.reason && touched.reason ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Describe the reason for the ban..."
                        />
                        {errors.reason && touched.reason && (
                            <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
                        )}
                    </div>

                    {/* Evidence */}
                    <div className="col-span-full">
                        <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-1">
                            Evidence <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="evidence"
                            name="evidence"
                            value={formData.evidence || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={5}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                ${errors.evidence && touched.evidence ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Provide detailed evidence for the ban..."
                        />
                        {errors.evidence && touched.evidence && (
                            <p className="mt-1 text-sm text-red-500">{errors.evidence}</p>
                        )}
                    </div>

                    {/* Evidence Images & Videos */}
                    <div className="col-span-full">
                        <label htmlFor="evidencePaths" className="block text-sm font-medium text-gray-700 mb-1">
                            Evidence Media URLs (Optional)
                        </label>
                        <textarea
                            id="evidencePaths"
                            name="evidencePaths"
                            value={evidencePathsInput}
                            onChange={handleEvidencePathsChange}
                            rows={3}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter media URLs separated by commas (e.g., https://example.com/image.jpg, https://youtube.com/watch?v=VIDEO_ID)"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Enter URLs to images or videos (YouTube, Vimeo, direct video links), separated by commas. These will be displayed on the ban page.
                        </p>
                    </div>

                    {/* Admin Notes */}
                    <div className="col-span-full">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                            Admin Notes (Optional)
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes || ''}
                            onChange={handleChange}
                            rows={3}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Add private notes for admins and moderators..."
                        />
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant="primary"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        {initialData?._id ? 'Update Ban' : 'Create Ban'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};  