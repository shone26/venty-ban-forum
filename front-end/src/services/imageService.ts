// This service handles the display and management of evidence images and videos

/**
 * Check if the provided URL is a video
 * @param url - The URL to check
 * @returns Boolean indicating if the URL points to a video
 */
export const isVideoUrl = (url: string): boolean => {
    if (!url) return false;
    
    // Common video file extensions
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv', '.flv', '.mkv'];
    
    // Video hosting services
    const videoHosts = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com', 'twitch.tv'];
    
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext)) ||
           videoHosts.some(host => url.toLowerCase().includes(host));
  };
  
  /**
   * Get the full URL for an image or video path
   * @param path - The path to the image or video
   * @returns The complete URL to access the media
   */
  export const getMediaUrl = (path: string): string => {
    if (!path) return '';
    
    // If the path is already an absolute URL, return it as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // For YouTube URLs that are shortened (youtu.be)
    if (path.includes('youtu.be/')) {
      const videoId = path.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // For YouTube URLs
    if (path.includes('youtube.com/watch?v=')) {
      const videoId = new URL(path).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // For Vimeo URLs
    if (path.includes('vimeo.com/')) {
      const videoId = path.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
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
    
    // If it's a video, it's not an image
    if (isVideoUrl(path)) return false;
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    return imageExtensions.some(ext => path.toLowerCase().endsWith(ext));
  };
  
  /**
   * Parse a string of comma-separated paths into an array of media paths
   * @param pathsString - The comma-separated string of paths
   * @returns Array of media paths
   */
  export const parseMediaPaths = (pathsString: string): string[] => {
    if (!pathsString) return [];
    
    return pathsString
      .split(',')
      .map(path => path.trim())
      .filter(path => path.length > 0);
  };
  
  /**
   * Convert media paths array back to a comma-separated string for storage
   * @param paths - Array of media paths
   * @returns Comma-separated string of paths
   */
  export const stringifyMediaPaths = (paths: string[]): string => {
    if (!paths || !Array.isArray(paths)) return '';
    
    return paths.join(',');
  };
  
  /**
   * Get a placeholder image URL when no media is available
   * @returns Placeholder image URL
   */
  export const getPlaceholderUrl = (): string => {
    return 'https://via.placeholder.com/400x300?text=No+Evidence';
  };
  
  /**
   * For backwards compatibility
   */
  export const getImageUrl = getMediaUrl;
  export const getPlaceholderImageUrl = getPlaceholderUrl;
  export const parseImagePaths = parseMediaPaths;