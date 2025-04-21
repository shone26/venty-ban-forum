// src/components/appeals/AppealStatusBadge.tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { AppealStatus } from '../../types';

interface AppealStatusBadgeProps {
  status: AppealStatus | string;
  className?: string;
}

const AppealStatusBadge: React.FC<AppealStatusBadgeProps> = ({ status, className = '' }) => {
  let badgeColor = '';
  
  switch (status?.toLowerCase()) {
    case AppealStatus.PENDING:
      badgeColor = 'bg-amber-100 text-amber-800';
      break;
    case AppealStatus.APPROVED:
      badgeColor = 'bg-green-100 text-green-800';
      break;
    case AppealStatus.REJECTED:
      badgeColor = 'bg-red-100 text-red-800';
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

export default AppealStatusBadge;