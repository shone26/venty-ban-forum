// src/components/ui/Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
}) => {
  const renderPageButtons = () => {
    const buttons = [];
    
    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
          currentPage === 1
            ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
        }`}
      >
        <span className="sr-only">Previous</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    );
    
    // First page
    buttons.push(
      <button
        key="1"
        onClick={() => onPageChange(1)}
        className={`relative inline-flex items-center px-4 py-2 border ${
          currentPage === 1
            ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
        }`}
      >
        1
      </button>
    );
    
    // Ellipsis or pages
    if (totalPages <= 7) {
      // Show all pages if there are 7 or fewer
      for (let i = 2; i < totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`relative inline-flex items-center px-4 py-2 border ${
              currentPage === i
                ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      // More complex pagination with ellipsis
      if (currentPage > 3) {
        buttons.push(
          <span key="ellipsis1" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700">
            ...
          </span>
        );
      }
      
      // Show a window of pages around the current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`relative inline-flex items-center px-4 py-2 border ${
              currentPage === i
                ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {i}
          </button>
        );
      }
      
      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="ellipsis2" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700">
            ...
          </span>
        );
      }
    }
    
    // Last page (if more than 1 page)
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`relative inline-flex items-center px-4 py-2 border ${
            currentPage === totalPages
              ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
          }`}
        >
          {totalPages}
        </button>
      );
    }
    
    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
          currentPage === totalPages
            ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
        }`}
      >
        <span className="sr-only">Next</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    );
    
    return buttons;
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      {onPageSizeChange && (
        <div className="flex items-center mb-4 md:mb-0">
          <span className="text-sm text-gray-700 mr-2">Show</span>
          <select
            className="border-gray-300 rounded-md text-sm"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700 ml-2">entries</span>
        </div>
      )}
      
      <nav className="flex justify-center md:justify-end">
        <div className="flex border border-gray-300 rounded-md">
          {renderPageButtons()}
        </div>
      </nav>
    </div>
  );
};