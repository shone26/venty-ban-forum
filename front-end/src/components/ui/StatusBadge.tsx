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
    badgeClasses = 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300';
  } else if (status === BanStatus.EXPIRED) {
    badgeClasses = 'bg-gray-100 dark:bg-gray-800/60 text-gray-800 dark:text-gray-300';
  } else if (status === BanStatus.APPEALED) {
    badgeClasses = 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300';
  } else if (status === BanStatus.REVOKED) {
    badgeClasses = 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300';
  } 
  // Handle appeal statuses
  else if (status === AppealStatus.PENDING) {
    badgeClasses = 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300';
  } else if (status === AppealStatus.APPROVED) {
    badgeClasses = 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300';
  } else if (status === AppealStatus.REJECTED) {
    badgeClasses = 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300';
  } else {
    badgeClasses = 'bg-gray-100 dark:bg-gray-800/60 text-gray-800 dark:text-gray-300';
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