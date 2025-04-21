import React from 'react';
import { Ban } from '../../api/types';
import { Card } from '../common/Card';
import { formatDate, getTimeRemaining } from '../../utils/formatDate';
import { BanStatusBadge } from './BanStatusBadge';
import { EvidenceGallery } from './EvidenceGallery';

interface BanDetailsPanelProps {
  ban: Ban;
  className?: string;
}

export const BanDetailsPanel: React.FC<BanDetailsPanelProps> = ({
  ban,
  className = '',
}) => {
  if (!ban) return null;
  
  // Check if ban is expired but still active
  const isExpired = ban.durationType === 'temporary' && 
    ban.expiresAt && 
    new Date(ban.expiresAt) < new Date() && 
    ban.status === 'active';
  
  // Get display info for banned by
  const getBannedByInfo = () => {
    if (typeof ban.bannedBy === 'string') {
      return ban.bannedBy || 'Unknown Admin';
    }
    return ban.bannedBy?.username || 'Unknown Admin';
  };

  // Check if we have evidence media
  const hasEvidenceMedia = ban.evidencePaths && Array.isArray(ban.evidencePaths) && ban.evidencePaths.length > 0;
  
  return (
    <Card className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Ban Information</h2>
          <div className="flex items-center">
            <BanStatusBadge status={ban.status} />
            {isExpired && (
              <span className="ml-2 text-orange-500 text-sm">
                (Expired but not processed)
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Ban Type</h3>
            <p className="font-medium">
              {ban.durationType === 'permanent' ? 'Permanent Ban' : 'Temporary Ban'}
            </p>
          </div>
          
          {ban.durationType === 'temporary' && ban.expiresAt && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Expires On</h3>
              <p className="font-medium">
                {formatDate(ban.expiresAt, true)}
                <span className="ml-2 text-sm text-gray-500">
                  ({getTimeRemaining(ban.expiresAt)})
                </span>
              </p>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Banned By</h3>
            <p className="font-medium">{getBannedByInfo()}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date Issued</h3>
            <p className="font-medium">{formatDate(ban.createdAt, true)}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Player Information</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs text-gray-500">Player Name</h4>
                <p className="font-medium">{ban.playerName}</p>
              </div>
              <div>
                <h4 className="text-xs text-gray-500">Steam ID</h4>
                <p className="font-medium font-mono text-sm">{ban.steamId}</p>
              </div>
              {ban.discordId && (
                <div>
                  <h4 className="text-xs text-gray-500">Discord ID</h4>
                  <p className="font-medium font-mono text-sm">{ban.discordId}</p>
                </div>
              )}
              {ban.ipAddress && (
                <div>
                  <h4 className="text-xs text-gray-500">IP Address</h4>
                  <p className="font-medium font-mono text-sm">{ban.ipAddress}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Reason for Ban</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="whitespace-pre-line">{ban.reason}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Evidence</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="whitespace-pre-line">{ban.evidence}</p>
          </div>
        </div>
        
        {/* Evidence Media Gallery - Only display if we have evidence media */}
        {hasEvidenceMedia && (
          <div className="mb-6">
            <EvidenceGallery evidencePaths={ban.evidencePaths} />
          </div>
        )}
        
        {ban.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Admin Notes</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="whitespace-pre-line">{ban.notes}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};