/**
 * Format a date string or object into a readable format
 * @param dateString - ISO date string or Date object
 * @param includeTime - Whether to include the time in the formatted date
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | Date | undefined, includeTime = false): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      
      if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
      }
      
      return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };
  
  /**
   * Format a relative time (e.g., "2 days ago")
   * @param dateString - ISO date string or Date object
   * @returns Relative time string
   */
  export const getRelativeTime = (dateString: string | Date | undefined): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.round(diffMs / 1000);
      const diffMin = Math.round(diffSec / 60);
      const diffHour = Math.round(diffMin / 60);
      const diffDay = Math.round(diffHour / 24);
      
      if (diffSec < 60) {
        return 'just now';
      } else if (diffMin < 60) {
        return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
      } else if (diffHour < 24) {
        return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
      } else if (diffDay < 30) {
        return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
      } else {
        return formatDate(date);
      }
    } catch (error) {
      console.error('Error calculating relative time:', error);
      return 'Invalid Date';
    }
  };
  
  /**
   * Calculate time remaining until a date
   * @param dateString - ISO date string or Date object
   * @returns Time remaining string or 'Expired' if the date has passed
   */
  export const getTimeRemaining = (dateString: string | Date | undefined): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      const now = new Date();
      
      // If the date has already passed
      if (date <= now) {
        return 'Expired';
      }
      
      const diffMs = date.getTime() - now.getTime();
      const diffSec = Math.round(diffMs / 1000);
      const diffMin = Math.round(diffSec / 60);
      const diffHour = Math.round(diffMin / 60);
      const diffDay = Math.round(diffHour / 24);
      
      if (diffDay > 30) {
        return `${Math.round(diffDay / 30)} month${Math.round(diffDay / 30) === 1 ? '' : 's'} remaining`;
      } else if (diffDay > 0) {
        return `${diffDay} day${diffDay === 1 ? '' : 's'} remaining`;
      } else if (diffHour > 0) {
        return `${diffHour} hour${diffHour === 1 ? '' : 's'} remaining`;
      } else if (diffMin > 0) {
        return `${diffMin} minute${diffMin === 1 ? '' : 's'} remaining`;
      } else {
        return 'Less than a minute remaining';
      }
    } catch (error) {
      console.error('Error calculating time remaining:', error);
      return 'Invalid Date';
    }
  };