// src/pages/SignIn.tsx
import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

const SignIn: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            GTA RP Ban Management
          </h2>
          <ClerkSignIn />
        </div>
        <div className="text-center mt-4 text-gray-600">
          <p>Admin access only</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;