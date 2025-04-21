// src/components/ui/ImageModal.tsx
import React, { useEffect } from 'react';

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
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-85 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div className="max-w-5xl max-h-full p-4 relative">
        <img 
          src={imageUrl} 
          alt="Evidence" 
          className="max-w-full max-h-[90vh] object-contain bg-black/20 rounded shadow-lg"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
        />
        <button
          className="absolute top-4 right-4 bg-white dark:bg-dark-bg-tertiary rounded-full p-2 shadow-md transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <svg className="w-6 h-6 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};