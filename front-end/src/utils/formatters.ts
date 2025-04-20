// src/utils/formatters.ts

/**
 * Format a date with time
 */
export const formatDateTime = (date: Date | string | undefined | null): string => {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  /**
   * Format a date without time
   */
  export const formatDate = (date: Date | string | undefined | null): string => {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  /**
   * Get a human-readable time ago string
   */
  export const timeAgo = (date: Date | string | undefined | null): string => {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
  };
  
  /**
   * Format a ban's status for display
   */
  export const formatBanStatus = (ban: {
    isActive: boolean;
    expiresAt?: Date | null;
  }): string => {
    if (!ban.isActive) {
      return 'Inactive';
    }
    
    if (!ban.expiresAt) {
      return 'Permanent';
    }
    
    const now = new Date();
    const expiry = new Date(ban.expiresAt);
    
    if (expiry < now) {
      return 'Expired';
    }
    
    return 'Active';
  };
  
  /**
   * Get CSS classes for ban status badges
   */
  export const getBanStatusClasses = (status: string): string => {
    switch (status) {
      case 'Active':
        return 'bg-yellow-100 text-yellow-800';
      case 'Permanent':
        return 'bg-red-100 text-red-800';
      case 'Expired':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };