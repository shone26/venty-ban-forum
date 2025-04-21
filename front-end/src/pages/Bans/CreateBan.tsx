import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateBanDto } from '../../api/types';
import BanApi from '../../api/bans';
import { Layout } from '../../components/layout/Layout';
import { BanForm } from '../../components/bans/BanForm';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const CreateBan: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form submission
  const handleSubmit = async (formData: CreateBanDto) => {
    try {
      setIsSubmitting(true);
      
      // Submit the ban data to the API
      const response = await BanApi.createBan(formData);
      
      showToast('success', 'Ban created successfully');
      
      // Navigate to the new ban details page
      navigate(`/bans/${response._id}`);
    } catch (error) {
      console.error('Error creating ban:', error);
      showToast('error', 'Failed to create ban. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/bans');
  };
  
  return (
    <Layout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Ban</h1>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
        
        <BanForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </Layout>
  );
};

export default CreateBan;