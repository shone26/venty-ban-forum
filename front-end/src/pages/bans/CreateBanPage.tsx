// src/pages/bans/CreateBanPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import BanForm from '../../components/bans/BanForm';
import { CreateBanData } from '../../types';
import { createBan } from '../../api/bans';
import { useToast } from '../../components/common/ToastContext';


const CreateBanPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (data: CreateBanData) => {
    try {
      setIsSubmitting(true);
      const newBan = await createBan(data);
      showToast('success', 'Ban created successfully');
      navigate(`/bans/${newBan._id}`);
    } catch (error) {
      console.error('Error creating ban:', error);
      showToast('error', 'Failed to create ban. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/bans');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create New Ban</h1>
      </div>

      <Card className="p-6">
        <BanForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
};

export default CreateBanPage;