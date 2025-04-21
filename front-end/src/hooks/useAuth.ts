// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { User, UserRole } from '../api/types';
import UserApi from '../api/users'; 
import api from '../api/axios';

export const useAuth = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const clerk = useClerk();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (!clerkUser || !isLoaded) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        // Get token and set it for the API
        const token = await clerk.session?.getToken();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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

        // Create or update user in backend
        const userResponse = await UserApi.createUser(userData);
        setUser(userResponse);
      } catch (error) {
        console.error('Error syncing user with backend:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    syncUserWithBackend();
  }, [clerkUser, isLoaded]);

  const signOut = async () => {
    await clerk.signOut();
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAdmin: user?.roles?.includes(UserRole.ADMIN) || false,
    signOut
  };
};