// src/components/bans/BanStatusBadge.tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { BanStatus } from '../../types';

interface BanStatusBadgeProps {
  status: BanStatus | string;
  className?: string;
}

const BanStatusBadge: React.FC<BanStatusBadgeProps> = ({ status, className = '' }) => {
  let badgeColor = '';
  
  switch (status?.toLowerCase()) {
    case BanStatus.ACTIVE:
      badgeColor = 'bg-red-100 text-red-800';
      break;
    case BanStatus.EXPIRED:
      badgeColor = 'bg-gray-100 text-gray-800';
      break;
    case BanStatus.APPEALED:
      badgeColor = 'bg-green-100 text-green-800';
      break;
    case BanStatus.REVOKED:
      badgeColor = 'bg-amber-100 text-amber-800';
      break;
    default:
      badgeColor = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={twMerge(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      badgeColor,
      className
    )}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  );
};

export default BanStatusBadge;