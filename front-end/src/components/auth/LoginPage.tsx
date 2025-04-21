import React from 'react';
import { SignInButton } from "@clerk/clerk-react";

const LoginComponent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        Welcome to GTA RP Ban Management
      </h2>
      <p className="text-gray-600 text-center">
        Please sign in to access the system
      </p>
      
      <SignInButton mode="modal">
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Sign In
        </button>
      </SignInButton>
      
      <div className="text-sm text-gray-500 text-center">
        <p>Secure login powered by Clerk</p>
      </div>
    </div>
  );
};

export default LoginComponent;