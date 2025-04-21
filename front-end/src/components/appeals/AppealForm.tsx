// src/components/appeals/AppealForm.tsx
import React, { useState } from 'react';
import { CreateAppealData } from '../../types';
import Button from '../common/Button';

interface AppealFormProps {
  banId?: string;
  onSubmit: (data: CreateAppealData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const AppealForm: React.FC<AppealFormProps> = ({
  banId = '',
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<CreateAppealData>({
    ban: banId,
    reason: '',
    evidence: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    if (!formData.reason) newErrors.reason = 'Reason is required';
    if (!formData.evidence) newErrors.evidence = 'Evidence is required';

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
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          Reason for Appeal *
        </label>
        <textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows={3}
          placeholder="Explain why you believe this ban should be appealed"
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
          Evidence for Appeal *
        </label>
        <textarea
          id="evidence"
          name="evidence"
          value={formData.evidence}
          onChange={handleChange}
          rows={5}
          placeholder="Provide any evidence that supports your appeal (screenshots, video links, testimonials, etc.)"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
            errors.evidence ? 'border-red-300' : ''
          }`}
        />
        {errors.evidence && (
          <p className="mt-1 text-sm text-red-600">{errors.evidence}</p>
        )}
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
          Submit Appeal
        </Button>
      </div>
    </form>
  );
};

export default AppealForm;