import React, { useState } from 'react';
import { getImageUrl, parseImagePaths, getPlaceholderImageUrl } from '../../services/imageService';
import { Modal } from '../common/Modals';


interface EvidenceGalleryProps {
  evidencePaths?: string[] | string;
  className?: string;
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({
  evidencePaths,
  className = '',
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  // Parse evidence paths if they are a string
  const images = Array.isArray(evidencePaths)
    ? evidencePaths
    : parseImagePaths(evidencePaths || '');
  
  // If no images, show placeholder
  if (!images.length) {
    return (
      <div className={`flex justify-center ${className}`}>
        <div className="bg-gray-100 rounded-md p-4 text-center">
          <img
            src={getPlaceholderImageUrl()}
            alt="No evidence provided"
            className="mx-auto h-32 w-auto object-contain"
          />
          <p className="mt-2 text-sm text-gray-500">No evidence images available</p>
        </div>
      </div>
    );
  }
  
  // Open image in modal
  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };
  
  // Close image modal
  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };
  
  // Navigate to previous image
  const goToPreviousImage = () => {
    if (selectedImageIndex === null || images.length <= 1) return;
    setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
  };
  
  // Navigate to next image
  const goToNextImage = () => {
    if (selectedImageIndex === null || images.length <= 1) return;
    setSelectedImageIndex((selectedImageIndex + 1) % images.length);
  };
  
  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-gray-500 mb-2">Evidence Images</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((path, index) => (
          <div
            key={index}
            className="relative aspect-video bg-gray-100 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openImageModal(index)}
          >
            <img
              src={getImageUrl(path)}
              alt={`Evidence ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder on error
                (e.target as HTMLImageElement).src = getPlaceholderImageUrl();
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Image modal */}
      <Modal
        isOpen={selectedImageIndex !== null}
        onClose={closeImageModal}
        size="xl"
      >
        {selectedImageIndex !== null && (
          <div className="flex flex-col items-center">
            <div className="relative w-full">
              <img
                src={getImageUrl(images[selectedImageIndex])}
                alt={`Evidence ${selectedImageIndex + 1}`}
                className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                onError={(e) => {
                  // Fallback to placeholder on error
                  (e.target as HTMLImageElement).src = getPlaceholderImageUrl();
                }}
              />
              
              {/* Navigation buttons */}
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r-md hover:bg-opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPreviousImage();
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
                      goToNextImage();
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
                Image {selectedImageIndex + 1} of {images.length}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};