// src/components/layout/Layout.tsx
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, useClerk, useUser } from '@clerk/clerk-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useToast } from '../../context/ToastContext';
import UserApi from '../../api/users';
import api from '../../api/axios';
import { UserRole } from '../../api/types';

export const Layout: React.FC = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const { session } = useClerk();
  const { showToast } = useToast();

  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (!clerkUser || !isLoaded) return;

      try {
        // Get token and set it for the API
        const token = await session?.getToken();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Also add the Clerk ID to headers for backend recognition
          api.defaults.headers.common['X-Clerk-ID'] = clerkUser.id;
        }

        // Prepare user data for backend
        const userData = {
          clerkId: clerkUser.id,
          username: clerkUser.username || 
                    clerkUser.fullName || 
                    clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0] || 
                    'User',
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          roles: [UserRole.USER] // Default role
        };

        console.log('Syncing user with backend:', userData);

        // Create or update user in backend
        await UserApi.createUser(userData);
        
      } catch (error) {
        console.error('Error syncing user with backend:', error);
        showToast('error', 'Failed to sync user data with the server');
      }
    };

    syncUserWithBackend();
  }, [clerkUser, isLoaded, session]);

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