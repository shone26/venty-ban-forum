// src/components/appeals/AppealDetails.tsx
import React, { useState } from 'react';
import { Appeal, AppealStatus } from '../../types';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { ImageModal } from '../ui/ImageModal';

interface AppealDetailsProps {
  appeal: Appeal;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
}

export const AppealDetails: React.FC<AppealDetailsProps> = ({
  appeal,
  onApprove,
  onReject,
  onDelete,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const isPending = appeal.status === AppealStatus.PENDING;

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold">Appeal Details</h2>
            <div className="flex items-center mt-1">
              <StatusBadge status={appeal.status} />
              <span className="ml-2 text-gray-600 text-sm">
                Submitted on {formatDate(appeal.createdAt)}
              </span>
            </div>
          </div>
          
          {isPending && (
            <div className="flex gap-2">
              {onApprove && (
                <Button
                  variant="primary"
                  onClick={onApprove}
                >
                  Approve
                </Button>
              )}
              
              {onReject && (
                <Button
                  variant="danger"
                  onClick={onReject}
                >
                  Reject
                </Button>
              )}
              
              {onDelete && (
                <Button
                  variant="outline"
                  onClick={onDelete}
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-8">
          <div>
            <h3 className="text-md font-medium mb-2">Appealed By</h3>
            <p className="font-medium mb-4">
              {typeof appeal.appealedBy === 'object' && appeal.appealedBy?.username 
                ? appeal.appealedBy.username 
                : 'Unknown User'}
            </p>
            
            <h3 className="text-md font-medium mb-2">Reason for Appeal</h3>
            <div className="p-3 bg-gray-50 rounded-md mb-4">
              <p className="whitespace-pre-line">{appeal.reason}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-2">Evidence</h3>
            <div className="p-3 bg-gray-50 rounded-md mb-4">
              <p className="whitespace-pre-line">{appeal.evidence}</p>
            </div>
            
            {appeal.evidencePhotos && appeal.evidencePhotos.length > 0 && (
              <div>
                <h4 className="text-md font-medium mb-2">Photo Evidence</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {appeal.evidencePhotos.map((photo, index) => (
                    <div 
                      key={index} 
                      className="relative aspect-square rounded-md overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(photo)}
                    >
                      <img 
                        src={photo} 
                        alt={`Evidence ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {(appeal.status === AppealStatus.APPROVED || appeal.status === AppealStatus.REJECTED) && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-md font-medium mb-2">Review Information</h3>
            <div className="flex flex-col sm:flex-row sm:gap-6">
              <div className="mb-2 sm:mb-0">
                <p className="text-sm text-gray-500">Reviewed By</p>
                <p className="font-medium">
                  {typeof appeal.reviewedBy === 'object' && appeal.reviewedBy?.username 
                    ? appeal.reviewedBy.username 
                    : 'Unknown Admin'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Reviewed On</p>
                <p className="font-medium">{formatDate(appeal.updatedAt)}</p>
              </div>
            </div>
            
            {appeal.reviewNotes && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-1">Review Notes</p>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="whitespace-pre-line">{appeal.reviewNotes}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Image Modal for enlarged view */}
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
        />
      )}
    </Card>
  );
};