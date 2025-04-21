// src/hooks/useAuth.ts
import { useClerk, useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { UserRole, AuthUser } from '../types';

export const useAuth = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { signOut } = useClerk();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isClerkLoaded && clerkUser) {
        try {
          // Make sure the token is properly set in localStorage
          const token = localStorage.getItem('clerk-auth-token');
          if (!token) {
            const session = await clerkUser.session;
            if (session) {
              localStorage.setItem('clerk-auth-token', session.jwt);
            }
          }
          
          const response = await axios.get('/auth/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // If 401 error, we should clear the token
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            localStorage.removeItem('clerk-auth-token');
          }
        } finally {
          setIsLoading(false);
        }
      } else if (isClerkLoaded && !clerkUser) {
        localStorage.removeItem('clerk-auth-token');
        setUser(null);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [isClerkLoaded, clerkUser]);

  const hasPermission = (requiredRoles: UserRole[]) => {
    if (!user || !user.roles) return false;
    return requiredRoles.some((role) => user.roles.includes(role));
  };

  const logout = async () => {
    localStorage.removeItem('clerk-auth-token');
    await signOut();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || !isClerkLoaded,
    hasPermission,
    logout,
  };
};