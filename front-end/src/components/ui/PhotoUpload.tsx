// src/components/ui/PhotoUpload.tsx
import React, { useRef, useState } from 'react';
import { Button } from './Button';

interface PhotoUploadProps {
  onChange: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  value?: File[];
  existingPhotos?: string[];
  onRemoveExisting?: (url: string) => void;
  className?: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onChange,
  multiple = true,
  maxFiles = 5,
  value = [],
  existingPhotos = [],
  onRemoveExisting,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  // Generate previews when files change
  React.useEffect(() => {
    // Clear old previews
    previews.forEach(preview => URL.revokeObjectURL(preview));
    
    // Create new previews
    const newPreviews = value.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
    
    // Cleanup function
    return () => {
      newPreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [value]);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Check if adding these files would exceed the max
    const totalFiles = value.length + files.length;
    if (totalFiles > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }
    
    // Add new files to the existing ones
    onChange([...value, ...files]);
    
    // Reset the input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    // Create a new array without the removed file
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap gap-4">
        {/* Existing photos from backend */}
        {existingPhotos.map((url, index) => (
          <div key={`existing-${index}`} className="relative w-24 h-24 border rounded overflow-hidden group">
            <img 
              src={url} 
              alt={`Uploaded ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            {onRemoveExisting && (
              <button
                type="button"
                onClick={() => onRemoveExisting(url)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
        
        {/* New file previews */}
        {previews.map((preview, index) => (
          <div key={`preview-${index}`} className="relative w-24 h-24 border rounded overflow-hidden group">
            <img 
              src={preview} 
              alt={`Preview ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple={multiple}
          accept="image/*"
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={value.length >= maxFiles}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Photos
        </Button>
        <p className="text-xs text-gray-500 mt-1">
          {multiple 
            ? `You can upload up to ${maxFiles} photos. ${value.length} of ${maxFiles} used.` 
            : 'Upload a photo as evidence.'}
        </p>
      </div>
    </div>
  );
};