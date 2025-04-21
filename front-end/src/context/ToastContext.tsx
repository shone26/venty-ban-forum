import React, { createContext, useState, useCallback, ReactNode } from 'react';

// Define toast types for styling
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Define toast message structure
export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

// Define context interface
interface ToastContextProps {
  toasts: ToastMessage[];
  showToast: (type: ToastType, message: string) => void;
  hideToast: (id: string) => void;
}

// Create context with default values
export const ToastContext = createContext<ToastContextProps>({
  toasts: [],
  showToast: () => {},
  hideToast: () => {},
});

// Provider component for toast functionality
interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Add a new toast with auto-removal after a delay
  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now().toString();
    
    setToasts(prevToasts => [
      ...prevToasts,
      { id, type, message }
    ]);
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      hideToast(id);
    }, 5000);
  }, []);

  // Remove a specific toast by ID
  const hideToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      
      {/* Toast container that displays all active toasts */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`px-4 py-3 rounded-md shadow-md flex items-center justify-between transition-opacity duration-300 ${
              toast.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
              toast.type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' :
              toast.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500' :
              'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
            }`}
          >
            <span>{toast.message}</span>
            <button 
              onClick={() => hideToast(toast.id)}
              className="ml-3 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook for accessing the toast context
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};