import React, { useState } from 'react';
import { 
  getMediaUrl, 
  parseMediaPaths, 
  getPlaceholderUrl, 
  isVideoUrl 
} from '../../services/imageService';
import { Modal } from '../common/Modals';

interface EvidenceGalleryProps {
  evidencePaths?: string[] | string;
  className?: string;
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({
  evidencePaths,
  className = '',
}) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  
  // Parse evidence paths if they are a string
  const mediaItems = Array.isArray(evidencePaths)
    ? evidencePaths
    : parseMediaPaths(evidencePaths || '');
  
  // If no media, show placeholder
  if (!mediaItems.length) {
    return (
      <div className={`flex justify-center ${className}`}>
        <div className="bg-gray-100 rounded-md p-4 text-center">
          <img
            src={getPlaceholderUrl()}
            alt="No evidence provided"
            className="mx-auto h-32 w-auto object-contain"
          />
          <p className="mt-2 text-sm text-gray-500">No evidence media available</p>
        </div>
      </div>
    );
  }
  
  // Open media in modal
  const openMediaModal = (index: number) => {
    setSelectedMediaIndex(index);
  };
  
  // Close media modal
  const closeMediaModal = () => {
    setSelectedMediaIndex(null);
  };
  
  // Navigate to previous media
  const goToPreviousMedia = () => {
    if (selectedMediaIndex === null || mediaItems.length <= 1) return;
    setSelectedMediaIndex((selectedMediaIndex - 1 + mediaItems.length) % mediaItems.length);
  };
  
  // Navigate to next media
  const goToNextMedia = () => {
    if (selectedMediaIndex === null || mediaItems.length <= 1) return;
    setSelectedMediaIndex((selectedMediaIndex + 1) % mediaItems.length);
  };

  // Render YouTube embed
  const renderYouTubeEmbed = (url: string) => {
    try {
      let videoId = '';
      
      if (url.includes('youtube.com/watch')) {
        // Handle standard YouTube URLs
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v') || '';
      } else if (url.includes('youtu.be/')) {
        // Handle shortened YouTube URLs
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      
      if (!videoId) return renderGenericVideo(url);
      
      return (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full object-cover"
        ></iframe>
      );
    } catch (e) {
      return renderGenericVideo(url);
    }
  };

  // Render Vimeo embed
  const renderVimeoEmbed = (url: string) => {
    try {
      const vimeoRegex = /vimeo\.com\/(\d+)/;
      const match = url.match(vimeoRegex);
      const videoId = match ? match[1] : null;
      
      if (!videoId) return renderGenericVideo(url);
      
      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full object-cover"
        ></iframe>
      );
    } catch (e) {
      return renderGenericVideo(url);
    }
  };

  // Render a generic video player
  const renderGenericVideo = (url: string) => {
    return (
      <video
        src={getMediaUrl(url)}
        controls
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to placeholder on error
          (e.target as HTMLVideoElement).poster = getPlaceholderUrl();
        }}
      >
        Your browser does not support the video tag.
      </video>
    );
  };

  // Render the appropriate media item
  const renderMediaItem = (url: string, inModal: boolean = false) => {
    const isVideo = isVideoUrl(url);
    
    if (isVideo) {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return renderYouTubeEmbed(url);
      } else if (url.includes('vimeo.com')) {
        return renderVimeoEmbed(url);
      } else {
        return renderGenericVideo(url);
      }
    } else {
      // It's an image
      return (
        <img
          src={getMediaUrl(url)}
          alt={`Evidence`}
          className={`${inModal ? 'w-full h-auto max-h-[70vh] object-contain mx-auto' : 'w-full h-full object-cover'}`}
          onError={(e) => {
            // Fallback to placeholder on error
            (e.target as HTMLImageElement).src = getPlaceholderUrl();
          }}
        />
      );
    }
  };
  
  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-gray-500 mb-2">Evidence Media</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {mediaItems.map((path, index) => (
          <div
            key={index}
            className="relative aspect-video bg-gray-100 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openMediaModal(index)}
          >
            {renderMediaItem(path)}
            {isVideoUrl(path) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Media modal */}
      <Modal
        isOpen={selectedMediaIndex !== null}
        onClose={closeMediaModal}
        size="xl"
      >
        {selectedMediaIndex !== null && (
          <div className="flex flex-col items-center">
            <div className="relative w-full">
              {renderMediaItem(mediaItems[selectedMediaIndex], true)}
              
              {/* Navigation buttons */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r-md hover:bg-opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPreviousMedia();
                    }}
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l-md hover:bg-opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNextMedia();
                    }}
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-500">
                {isVideoUrl(mediaItems[selectedMediaIndex]) ? 'Video' : 'Image'} {selectedMediaIndex + 1} of {mediaItems.length}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};