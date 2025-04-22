// src/components/auth/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { UserRole } from '../../api/types';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../common/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const location = useLocation();
  const { isSignedIn, isLoaded: isClerkLoaded } = useClerkAuth();
  const { user, isAdmin, hasPermission, isLoading: isUserLoading, error } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log(`ProtectedRoute (${location.pathname}) - Auth State:`, {
      isSignedIn,
      isClerkLoaded,
      isUserLoading,
      user: user ? {
        id: user._id,
        username: user.username,
        roles: user.roles
      } : null,
      isAdmin,
      adminOnly,
      hasAccess: adminOnly ? isAdmin : true,
      error
    });
  }, [isSignedIn, isClerkLoaded, user, isAdmin, adminOnly, isUserLoading, location.pathname, error]);

  // Still loading authentication state
  if (!isClerkLoaded || isUserLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    console.log('User not signed in, redirecting to sign-in page');
    return <Navigate to="/sign-in" replace />;
  }

  // Admin-only route but user is not admin
  if (adminOnly && !isAdmin) {
    console.log('Admin access required but user is not admin, redirecting to unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  // Authentication error
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center max-w-md p-6 bg-white rounded shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};