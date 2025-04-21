// src/pages/bans/BanFormPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Ban } from '../../types';
import { bansApi } from '../../services/api';
import { BanForm } from '../../components/bans/BanForm';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const BanFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [ban, setBan] = useState<Ban | null>(null);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch ban data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchBan = async () => {
        try {
          setLoading(true);
          const data = await bansApi.getBanById(id);
          setBan(data);
        } catch (err: any) {
          console.error('Error fetching ban:', err);
          setError(err.response?.data?.message || 'Failed to fetch ban details.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchBan();
    }
  }, [id, isEditMode]);
  
  // Handle successful form submission
  const handleSuccess = (newBan: Ban) => {
    navigate(`/bans/${newBan._id}`);
  };
  
  if (isEditMode && loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (isEditMode && error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert
          variant="error"
          title="Error"
          message={error}
        />
        <div className="mt-4">
          <Button
            variant="primary"
            onClick={() => navigate('/bans')}
          >
            Back to Bans
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {isEditMode ? 'Edit Ban' : 'Create New Ban'}
        </h1>
        <Button
          variant="outline"
          onClick={() => navigate(isEditMode ? `/bans/${id}` : '/bans')}
        >
          Cancel
        </Button>
      </div>
      
      <Card>
        <div className="p-6">
          <BanForm
            initialValues={ban || undefined}
            onSuccess={handleSuccess}
            isEdit={isEditMode}
          />
        </div>
      </Card>
    </div>
  );
};

export default BanFormPage;