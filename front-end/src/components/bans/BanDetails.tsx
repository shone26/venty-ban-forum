// src/components/bans/BanDetails.tsx
import React, { useState } from 'react';
import { Ban, BanDuration, BanStatus } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { ImageModal } from '../ui/ImageModal';

interface BanDetailsProps {
  ban: Ban;
  onEdit?: () => void;
  onDelete?: () => void;
  onAppeal?: () => void;
  onUpdateStatus?: () => void;
}

export const BanDetails: React.FC<BanDetailsProps> = ({
  ban,
  onEdit,
  onDelete,
  onAppeal,
  onUpdateStatus,
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
  
  const isExpired = 
    ban.durationType === BanDuration.TEMPORARY && 
    ban.expiresAt && 
    new Date(ban.expiresAt) < new Date() && 
    ban.status === BanStatus.ACTIVE;
  
  const canAppeal = ban.status === BanStatus.ACTIVE && 
    (!ban.appeals || !ban.appeals.some(appeal => 
      appeal.status === 'pending' || appeal.status === 'approved'
    ));

  return (
    <>
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">Ban Details</h2>
              <div className="flex items-center mt-2">
                <StatusBadge status={ban.status} />
                {isExpired && (
                  <span className="ml-2 text-amber-500 text-sm font-medium">
                    (Expired but not processed)
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="secondary"
                  onClick={onEdit}
                >
                  Edit
                </Button>
              )}
              
              {onUpdateStatus && (
                <Button
                  variant="outline"
                  onClick={onUpdateStatus}
                >
                  Update Status
                </Button>
              )}
              
              {onDelete && (
                <Button
                  variant="danger"
                  onClick={onDelete}
                >
                  Delete
                </Button>
              )}
              
              {canAppeal && onAppeal && (
                <Button
                  variant="primary"
                  onClick={onAppeal}
                >
                  Submit Appeal
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Player Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Player Name</p>
                  <p className="font-medium">{ban.playerName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Steam ID</p>
                  <p className="font-medium font-mono">{ban.steamId}</p>
                </div>
                
                {ban.discordId && (
                  <div>
                    <p className="text-sm text-gray-500">Discord ID</p>
                    <p className="font-medium">{ban.discordId}</p>
                  </div>
                )}
                
                {ban.ipAddress && (
                  <div>
                    <p className="text-sm text-gray-500">IP Address</p>
                    <p className="font-medium font-mono">{ban.ipAddress}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Ban Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Ban Type</p>
                  <p className="font-medium">
                    {ban.durationType === BanDuration.PERMANENT 
                      ? 'Permanent Ban' 
                      : 'Temporary Ban'}
                  </p>
                </div>
                
                {ban.durationType === BanDuration.TEMPORARY && ban.expiresAt && (
                  <div>
                    <p className="text-sm text-gray-500">Expires On</p>
                    <p className="font-medium">
                      {formatDate(ban.expiresAt)}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500">Banned By</p>
                  <p className="font-medium">
                    {typeof ban.bannedBy === 'object' && ban.bannedBy?.username 
                      ? ban.bannedBy.username 
                      : 'Unknown Admin'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Date Issued</p>
                  <p className="font-medium">
                    {formatDate(ban.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="mb-6">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Reason for Ban</h3>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="whitespace-pre-line">{ban.reason}</p>
          </div>
        </div>
      </Card>
      
      <Card className="mb-6">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Evidence</h3>
          <div className="p-4 bg-gray-50 rounded-md mb-4">
            <p className="whitespace-pre-line">{ban.evidence}</p>
          </div>
          
          {ban.evidencePhotos && ban.evidencePhotos.length > 0 && (
            <div>
              <h4 className="text-md font-medium mb-2">Photo Evidence</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {ban.evidencePhotos.map((photo, index) => (
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
      </Card>
      
      {ban.notes && (
        <Card className="mb-6">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Admin Notes</h3>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="whitespace-pre-line">{ban.notes}</p>
            </div>
          </div>
        </Card>
      )}
      
      {/* Image Modal for enlarged view */}
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
        />
      )}
    </>
  );
};