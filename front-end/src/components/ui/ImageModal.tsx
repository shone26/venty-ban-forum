// src/components/ui/ImageModal.tsx
import React from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div className="max-w-4xl max-h-full p-4">
        <img 
          src={imageUrl} 
          alt="Evidence" 
          className="max-w-full max-h-[90vh] object-contain"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
        />
        <button
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};