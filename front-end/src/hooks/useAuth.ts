// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { User, UserRole } from '../api/types';
import api from '../api/axios';

interface UseAuthHook {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

export const useAuth = (): UseAuthHook => {
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

        // Attempt to create or get user
        const response = await api.post('/users', userData);
        
        setUser(response.data);
      } catch (error) {
        console.error('Error syncing user with backend:', error);
        
        try {
          // If creation fails, try fetching existing user
          const response = await api.get('/users/me');
          setUser(response.data);
        } catch (fetchError) {
          console.error('Error fetching user:', fetchError);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    syncUserWithBackend();
  }, [clerkUser, isLoaded]);

  const signOut = async () => {
    await clerk.signOut();
  };

  return {
    user,
    isLoading,
    isAdmin: user?.roles.includes(UserRole.ADMIN) || false,
    signOut
  };
};