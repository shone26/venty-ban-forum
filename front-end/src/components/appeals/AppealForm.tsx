// src/components/appeals/AppealForm.tsx
import React, { useState } from 'react';
import { Appeal } from '../../types';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { PhotoUpload } from '../ui/PhotoUpload';
import { appealsApi } from '../../services/api';

interface AppealFormProps {
  banId: string;
  onSuccess?: (appeal: Appeal) => void;
  onCancel?: () => void;
}

export const AppealForm: React.FC<AppealFormProps> = ({
  banId,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Appeal>>({
    ban: banId,
    reason: '',
    evidence: '',
  });
  
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        evidencePhotos: evidenceFiles,
      };

      const response = await appealsApi.createAppeal(submitData);

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err: any) {
      console.error('Error submitting appeal:', err);
      setError(err.response?.data?.message || 'Failed to submit appeal. Please try again.');
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

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
          Reason for Appeal <span className="text-red-500">*</span>
        </label>
        <textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
          rows={3}
          placeholder="Explain why you believe this ban should be appealed"
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
          placeholder="Provide evidence to support your appeal (explanation, context, etc.)"
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
          multiple={true}
          maxFiles={5}
        />
        <p className="mt-1 text-xs text-gray-500">
          Upload screenshots or other images that support your appeal (optional)
        </p>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          Submit Appeal
        </Button>
      </div>
    </form>
  );
};