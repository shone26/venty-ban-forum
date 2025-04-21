import React from 'react';
import { SignIn } from "@clerk/clerk-react";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            GTA RP Ban Management
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Secure Server Administration
          </p>
        </div>
        
        <div className="bg-white shadow-xl rounded-lg p-8 border border-gray-200">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "w-full shadow-none",
                headerTitle: "hidden", // Hide Clerk's default title
                headerSubtitle: "hidden", // Hide Clerk's default subtitle
                socialButtonsBlockButton: "w-full mb-4",
                formFieldLabel: "text-sm font-medium text-gray-700",
                formButtonPrimary: "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              }
            }}
          />
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} GTA RP Ban Management. 
            All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;