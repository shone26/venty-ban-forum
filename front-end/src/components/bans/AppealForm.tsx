import React, { useState } from 'react';
import { Button } from '../common/Button';

import { CreateAppealDto } from '../../api/types';
import { validateAppealForm } from '../../utils/validator';

interface AppealFormProps {
  banId?: string;
  onSubmit: (appealData: CreateAppealDto) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export const AppealForm: React.FC<AppealFormProps> = ({
  banId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  // Form data state
  const [formData, setFormData] = useState<Partial<CreateAppealDto>>({
    ban: banId || '',
    reason: '',
    evidence: '',
  });
  
  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
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
  
  // Handle form field blur for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'reason':
        if (!value) {
          error = 'Reason is required';
        } else if (value.length < 10) {
          error = 'Reason must be at least 10 characters long';
        }
        break;
      case 'evidence':
        if (!value) {
          error = 'Evidence is required';
        } else if (value.length < 10) {
          error = 'Evidence must be at least 10 characters long';
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
    const { isValid, errors: validationErrors } = validateAppealForm(formData);
    setErrors(validationErrors);
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // Submit if valid and banId is present
    if (isValid && banId) {
      onSubmit({
        ...formData,
        ban: banId,
      } as CreateAppealDto);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Appeal <span className="text-red-500">*</span>
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
            placeholder="Explain why this ban should be appealed..."
          />
          {errors.reason && touched.reason && (
            <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-1">
            Evidence for Appeal <span className="text-red-500">*</span>
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
            placeholder="Provide evidence to support your appeal..."
          />
          {errors.evidence && touched.evidence && (
            <p className="mt-1 text-sm text-red-500">{errors.evidence}</p>
          )}
        </div>
      </div>
      
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
          Submit Appeal
        </Button>
      </div>
    </form>
  );
};