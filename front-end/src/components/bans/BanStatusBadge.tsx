import React from 'react';
import { BanStatus } from '../../api/types';

interface BanStatusBadgeProps {
  status: BanStatus | string;
  className?: string;
}

export const BanStatusBadge: React.FC<BanStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  // Default to active if status is not valid
  const normalizedStatus = (status && Object.values(BanStatus).includes(status as BanStatus))
    ? status
    : BanStatus.ACTIVE;
  
  // Get styling based on status
  const getBadgeStyles = () => {
    switch (normalizedStatus) {
      case BanStatus.ACTIVE:
        return 'bg-red-100 text-red-800 border-red-200';
      case BanStatus.EXPIRED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case BanStatus.APPEALED:
        return 'bg-green-100 text-green-800 border-green-200';
      case BanStatus.REVOKED:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Format status for display
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyles()} ${className}`}
    >
      {formatStatus(normalizedStatus as string)}
    </span>
  );
};