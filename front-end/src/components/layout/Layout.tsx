// src/components/layout/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full">
      <SignedIn>
        <Header />
        <main className="flex-grow py-6 w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
        <Footer />
      </SignedIn>
      
      <SignedOut>
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              GTA RP Ban Management
            </h2>
            <p className="mb-6 text-gray-600">
              Please sign in to access the application
            </p>
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </div>
  );
};