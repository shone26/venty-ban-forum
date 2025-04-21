// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Spinner } from '../common/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { isAdmin, isLoading: isUserLoading } = useAuth();

  // Still loading authentication state
  if (!isLoaded || isUserLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // Admin-only route
  if (adminOnly && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};