// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { User, UserRole } from '../api/types';
import UserApi from '../api/users';
import api from '../api/axios';
import { setAuthToken } from '../api/axios'; // Make sure this is imported

export const useAuth = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const clerk = useClerk();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize authentication
  useEffect(() => {
    const initAuth = async () => {
      if (!clerkUser || !isLoaded) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // 1. Store Clerk ID in localStorage
        localStorage.setItem('clerkId', clerkUser.id);
        console.log('Stored clerk ID in localStorage:', clerkUser.id);
        
        // 2. Get JWT token and set it in axios headers
        const token = await clerk.session?.getToken();
        if (token) {
          setAuthToken(token);
          console.log('Set auth token in axios headers');
        } else {
          console.warn('No token available from Clerk session');
        }
        
        // 3. Make sure the Clerk ID header is set
        api.defaults.headers.common['X-Clerk-ID'] = clerkUser.id;
        
        // 4. Fetch or create user in backend
        try {
          console.log('Attempting to load user data from backend');
          const backendUser = await UserApi.getCurrentUser();
          console.log('Successfully loaded user from backend:', backendUser);
          setUser(backendUser);
        } catch (fetchError) {
          console.log('User not found in backend, creating new user');
          
          // User not found, create a new one
          const userData = {
            clerkId: clerkUser.id,
            username: clerkUser.username || 
                    clerkUser.fullName || 
                    clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0] || 
                    'User',
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            roles: [UserRole.USER], // Add ADMIN role for testing
          };
          
          const newUser = await UserApi.createUser(userData);
          console.log('Created new user in backend:', newUser);
          setUser(newUser);
        }
      } catch (err) {
        console.error('Error in authentication initialization:', err);
        setError('Authentication failed. Please try again.');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [clerkUser, isLoaded]);

  // Function to check if user has specific roles (case-insensitive)
  const hasPermission = (requiredRoles: UserRole[] | string[]): boolean => {
    if (!user || !user.roles || user.roles.length === 0) {
      console.log('hasPermission: No user or roles available');
      return false;
    }

    // Convert user roles to lowercase for case-insensitive comparison
    const userRoles = user.roles.map(role => 
      typeof role === 'string' ? role.toLowerCase() : role
    );
    
    console.log('Checking permissions:', {
      userRoles,
      requiredRoles,
      isAdmin: userRoles.includes('admin')
    });

    // Admin has all permissions
    if (userRoles.includes('admin')) {
      return true;
    }

    // Check if user has any of the required roles
    return requiredRoles.some(role => {
      const roleToCheck = typeof role === 'string' ? role.toLowerCase() : role;
      return userRoles.includes(roleToCheck as UserRole);
    });
  };

  // Function to refresh user data
  const refreshUserData = async () => {
    try {
      setIsLoading(true);
      const currentUser = await UserApi.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      console.error('Error refreshing user data:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    error,
    isAdmin: user?.roles?.some(role => 
      typeof role === 'string' && role.toLowerCase() === 'admin'
    ) || false,
    hasPermission,
    refreshUserData,
    signOut: async () => {
      await clerk.signOut();
      localStorage.removeItem('clerkId');
      setUser(null);
    }
  };
};