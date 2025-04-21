import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';

const NotFound: React.FC = () => {
  return (
    
      <div className="py-12 flex flex-col items-center">
        <div className="max-w-md text-center">
          <h1 className="text-9xl font-extrabold text-gray-900">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-8">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Button variant="primary" size="lg" onClick={() => window.location.href = '/'}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    
  );
};

export default NotFound;