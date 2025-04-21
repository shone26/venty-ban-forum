// src/components/bans/EvidenceGallery.tsx
import React, { useState } from 'react';
import { 
  getMediaUrl, 
  parseMediaPaths, 
  getPlaceholderUrl, 
  isVideoUrl
} from '../../services/imageService';

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
  
  // If no media, show message
  if (!mediaItems.length) {
    return (
      <div className={`text-center p-4 bg-gray-50 rounded-md ${className}`}>
        <p className="text-gray-500">No evidence media provided</p>
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

  // Render media item based on its type
  const renderMediaItem = (url: string, inModal: boolean = false) => {
    const isVideo = isVideoUrl(url);
    
    if (isVideo) {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        // Extract YouTube video ID
        let videoId = '';
        if (url.includes('youtube.com/watch')) {
          try {
            const urlObj = new URL(url);
            videoId = urlObj.searchParams.get('v') || '';
          } catch (e) {
            // Handle invalid URL
            const match = url.match(/[?&]v=([^&]+)/);
            videoId = match ? match[1] : '';
          }
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
        }
        
        if (videoId) {
          return (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={inModal ? "w-full h-full" : "absolute inset-0"}
            ></iframe>
          );
        }
      } else if (url.includes('vimeo.com')) {
        // Extract Vimeo video ID
        const vimeoRegex = /vimeo\.com\/(\d+)/;
        const match = url.match(vimeoRegex);
        const videoId = match ? match[1] : null;
        
        if (videoId) {
          return (
            <iframe
              src={`https://player.vimeo.com/video/${videoId}`}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className={inModal ? "w-full h-full" : "absolute inset-0"}
            ></iframe>
          );
        }
      }
      
      // Generic video
      return (
        <video
          src={getMediaUrl(url)}
          controls
          className={inModal ? "w-full h-auto max-h-[70vh]" : "absolute inset-0 object-cover"}
          onError={(e) => {
            // Fallback to placeholder on error
            e.currentTarget.poster = getPlaceholderUrl();
            console.error("Error loading video:", url);
          }}
        >
          Your browser does not support the video tag.
        </video>
      );
    } else {
      // It's an image
      return (
        <img
          src={getMediaUrl(url)}
          alt={`Evidence`}
          className={inModal 
            ? "w-full h-auto max-h-[80vh] object-contain" 
            : "w-full h-full object-cover transition-transform group-hover:scale-110"
          }
          onError={(e) => {
            // Fallback to placeholder on error
            e.currentTarget.src = getPlaceholderUrl();
            console.error("Error loading image:", url);
          }}
        />
      );
    }
  };
  
  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-gray-500 mb-2">Evidence Media</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {mediaItems.map((path, index) => (
          <div
            key={index}
            className="group relative aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer hover:shadow-md transition-all border border-gray-200"
            onClick={() => openMediaModal(index)}
          >
            <div className="absolute inset-0">
              {renderMediaItem(path)}
            </div>
            
            {/* Media type indicator */}
            {isVideoUrl(path) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-full p-2 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </div>
        ))}
      </div>
      
      {/* Media modal */}
      {selectedMediaIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
          onClick={closeMediaModal}
        >
          <div 
            className="relative max-w-screen-xl w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {renderMediaItem(mediaItems[selectedMediaIndex], true)}
            
            {/* Close button */}
            <button
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all z-10"
              onClick={closeMediaModal}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Navigation buttons */}
            {mediaItems.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
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
            
            {/* Caption/counter */}
            <div className="absolute bottom-4 left-0 right-0 text-center z-10">
              <div className="inline-block bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full">
                {isVideoUrl(mediaItems[selectedMediaIndex]) ? 'Video' : 'Image'} {selectedMediaIndex + 1} of {mediaItems.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};