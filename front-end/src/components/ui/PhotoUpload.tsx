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
  const [dragActive, setDragActive] = useState(false);

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
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    // Check if adding these files would exceed the max
    const totalFiles = value.length + files.length;
    if (totalFiles > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }
    
    // Filter out non-image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    // Add new files to the existing ones
    onChange([...value, ...imageFiles]);
    
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

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap gap-4">
        {/* Existing photos from backend */}
        {existingPhotos.map((url, index) => (
          <div key={`existing-${index}`} className="relative w-24 h-24 border dark:border-gray-600 rounded overflow-hidden group">
            <img 
              src={url} 
              alt={`Uploaded ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            {onRemoveExisting && (
              <button
                type="button"
                onClick={() => onRemoveExisting(url)}
                className="absolute top-1 right-1 bg-red-500 dark:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
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
          <div key={`preview-${index}`} className="relative w-24 h-24 border dark:border-gray-600 rounded overflow-hidden group">
            <img 
              src={preview} 
              alt={`Preview ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-red-500 dark:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      <div 
        className={`
          relative border-2 border-dashed rounded-lg p-6 
          ${dragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-bg-tertiary'} 
          transition-colors
          ${value.length >= maxFiles ? 'opacity-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple={multiple}
          accept="image/*"
          className="hidden"
          disabled={value.length >= maxFiles}
        />
        
        <div className="text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {dragActive 
              ? 'Drop your images here' 
              : 'Drag and drop your images here, or click to select files'}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            {multiple 
              ? `You can upload up to ${maxFiles} photos. ${value.length} of ${maxFiles} used.` 
              : 'Upload a photo as evidence.'}
          </p>
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClick}
              disabled={value.length >= maxFiles}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Select Files
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};