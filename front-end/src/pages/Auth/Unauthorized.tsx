// src/pages/Unauthorized.tsx
import React from 'react';

import { useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/common/Button';

const Unauthorized: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Unauthorized Access
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You do not have permission to access this page.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <Button 
            variant="primary" 
            fullWidth
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </div>
        <div className="text-center text-sm text-gray-500">
          <p>Only administrators can access this application.</p>
          <p>Please contact your system administrator if you believe this is an error.</p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;