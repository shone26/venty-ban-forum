// src/features/bans/components/BanStatusBadge.jsx
import React from 'react';

export const BanStatusBadge = ({ status }) => {
  let badgeColor = '';
  
  switch (status?.toLowerCase()) {
    case 'active':
      badgeColor = 'bg-red-100 text-red-800';
      break;
    case 'expired':
      badgeColor = 'bg-gray-100 text-gray-800';
      break;
    case 'appealed':
      badgeColor = 'bg-green-100 text-green-800';
      break;
    case 'revoked':
      badgeColor = 'bg-amber-100 text-amber-800';
      break;
    default:
      badgeColor = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  );
};