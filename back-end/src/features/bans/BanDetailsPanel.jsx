// src/components/bans/BanDetailsPanel.jsx
import React from 'react';
import { Card } from '../common/Card';
import { formatDate } from '../../utils/formatters';

export const BanDetailsPanel = ({ ban }) => {
  if (!ban) return null;

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Ban Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Type</h3>
            <p className="font-medium">
              {ban.durationType === 'permanent' ? 'Permanent Ban' : 'Temporary Ban'}
            </p>
          </div>
          
          {ban.durationType === 'temporary' && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Expires On</h3>
              <p className="font-medium">
                {formatDate(ban.expiresAt)}
              </p>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Banned By</h3>
            <p className="font-medium">
              {ban.bannedBy?.username || 'Unknown Admin'}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date Issued</h3>
            <p className="font-medium">
              {formatDate(ban.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Reason for Ban</h3>
          <div className="p-3 bg-gray-50 rounded">
            <p>{ban.reason}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Evidence</h3>
          <div className="p-3 bg-gray-50 rounded">
            <p className="whitespace-pre-line">{ban.evidence}</p>
          </div>
        </div>
        
        {ban.notes && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Admin Notes</h3>
            <div className="p-3 bg-gray-50 rounded">
              <p className="whitespace-pre-line">{ban.notes}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};