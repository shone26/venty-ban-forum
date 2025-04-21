// This service handles the display and management of evidence images

/**
 * Get the full URL for an image path
 * @param path - The relative path to the image
 * @returns The complete URL to access the image
 */
export const getImageUrl = (path: string): string => {
    if (!path) return '';
    
    // If the path is already an absolute URL, return it as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Otherwise, construct the URL using the backend address
    // This assumes your backend serves static files at the /uploads path
    return `http://localhost:3000/uploads/${path}`;
  };
  
  /**
   * Check if the provided path is a valid image type
   * @param path - The path to check
   * @returns Boolean indicating if the path is an image
   */
  export const isImagePath = (path: string): boolean => {
    if (!path) return false;
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => path.toLowerCase().endsWith(ext));
  };
  
  /**
   * Parse a string of comma-separated paths into an array of image paths
   * @param pathsString - The comma-separated string of paths
   * @returns Array of image paths
   */
  export const parseImagePaths = (pathsString: string): string[] => {
    if (!pathsString) return [];
    
    return pathsString
      .split(',')
      .map(path => path.trim())
      .filter(path => path.length > 0);
  };
  
  /**
   * Convert image paths array back to a comma-separated string for storage
   * @param paths - Array of image paths
   * @returns Comma-separated string of paths
   */
  export const stringifyImagePaths = (paths: string[]): string => {
    if (!paths || !Array.isArray(paths)) return '';
    
    return paths.join(',');
  };
  
  /**
   * Get a placeholder image URL when no image is available
   * @returns Placeholder image URL
   */
  export const getPlaceholderImageUrl = (): string => {
    return 'https://via.placeholder.com/400x300?text=No+Evidence+Image';
  };