// src/components/bans/BanCard.tsx
import React from 'react';
import { Ban } from '../../interfaces/Ban';

interface BanCardProps {
  ban: Ban;
}

const BanCard: React.FC<BanCardProps> = ({ ban }) => {
  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Permanent';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Determine status badge color
  const getStatusBadge = (ban: Ban) => {
    if (!ban.isActive) {
      return (
        <span className="bg-gray-200 text-gray-800 py-1 px-2 rounded-full text-xs font-medium">
          Inactive
        </span>
      );
    }

    if (!ban.expiresAt) {
      return (
        <span className="bg-red-100 text-red-800 py-1 px-2 rounded-full text-xs font-medium">
          Permanent
        </span>
      );
    }

    const now = new Date();
    const expiry = new Date(ban.expiresAt);

    if (expiry < now) {
      return (
        <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs font-medium">
          Expired
        </span>
      );
    }

    return (
      <span className="bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full text-xs font-medium">
        Active
      </span>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-900 truncate">
          {ban.playerName}
        </h3>
        {getStatusBadge(ban)}
      </div>

      <div className="mb-3">
        <span className="text-sm text-gray-600 block">
          Player ID: {ban.playerId}
        </span>
      </div>

      <p className="text-gray-700 mb-3 line-clamp-2">{ban.reason}</p>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          <span className="font-medium">By: </span>
          {ban.adminName}
        </div>

        <div className="flex flex-col items-end">
          <div>
            <span className="font-medium">Created: </span>
            {formatDate(ban.createdAt)}
          </div>
          <div>
            <span className="font-medium">Expires: </span>
            {formatDate(ban.expiresAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BanCard;