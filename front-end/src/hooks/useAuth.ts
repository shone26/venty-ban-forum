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
    const loadUserData = async () => {
      if (!clerkUser || !isLoaded) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Store clerk ID in localStorage for future requests
        localStorage.setItem('clerkId', clerkUser.id);

        // Set clerk ID in default headers
        api.defaults.headers.common['X-Clerk-ID'] = clerkUser.id;
        
        // Get token and set it for the request
        const token = await clerk.session?.getToken();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        // Try to get current user from the backend
        try {
          const currentUser = await UserApi.getCurrentUser();
          console.log("Current user from backend:", currentUser);
          setUser(currentUser);
        } catch (error) {
          console.log("User not found, creating new user");
          
          // If user not found, create a new one
          const userData = {
            clerkId: clerkUser.id,
            username: clerkUser.username || 
                     clerkUser.fullName || 
                     clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0] || 
                     'User',
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            roles: [UserRole.USER], // Default role
          };
          
          const newUser = await UserApi.createUser(userData);
          setUser(newUser);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [clerkUser, isLoaded]);

  // Function to refresh user data (useful after role changes)
  const refreshUserData = async () => {
    try {
      setIsLoading(true);
      const currentUser = await UserApi.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAdmin: user?.roles?.includes(UserRole.ADMIN) || false,
    refreshUserData,
    signOut: async () => {
      await clerk.signOut();
      localStorage.removeItem('clerkId');
      setUser(null);
    }
  };
};