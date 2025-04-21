// src/components/ui/StatusBadge.tsx
import React from 'react';
import { BanStatus, AppealStatus } from '../../types';

interface StatusBadgeProps {
  status: BanStatus | AppealStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  let badgeClasses = '';
  
  // Handle ban statuses
  if (status === BanStatus.ACTIVE) {
    badgeClasses = 'bg-red-100 text-red-800';
  } else if (status === BanStatus.EXPIRED) {
    badgeClasses = 'bg-gray-100 text-gray-800';
  } else if (status === BanStatus.APPEALED) {
    badgeClasses = 'bg-green-100 text-green-800';
  } else if (status === BanStatus.REVOKED) {
    badgeClasses = 'bg-amber-100 text-amber-800';
  } 
  // Handle appeal statuses
  else if (status === AppealStatus.PENDING) {
    badgeClasses = 'bg-amber-100 text-amber-800';
  } else if (status === AppealStatus.APPROVED) {
    badgeClasses = 'bg-green-100 text-green-800';
  } else if (status === AppealStatus.REJECTED) {
    badgeClasses = 'bg-red-100 text-red-800';
  } else {
    badgeClasses = 'bg-gray-100 text-gray-800';
  }
  
  const formattedStatus = typeof status === 'string' 
    ? status.charAt(0).toUpperCase() + status.slice(1) 
    : 'Unknown';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses} ${className}`}>
      {formattedStatus}
    </span>
  );
};