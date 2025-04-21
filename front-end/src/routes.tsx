// src/routes.tsx
import React from 'react';
import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  Navigate, 
  Outlet 
} from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';

// Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import BansListPage from './pages/bans/BansListPage';
import BanDetailsPage from './pages/bans/BanDetailsPage';
import CreateBanPage from './pages/bans/CreateBanPage';
import AppealsListPage from './pages/appeals/AppealsListPage';
import AppealDetailsPage from './pages/appeals/AppealDetailsPage';
import LoginPage from './pages/auth/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import { UserRole } from './types';

// Auth wrapper component that checks for authentication
const ProtectedRoute = ({ 
  requiredRoles 
}: { 
  requiredRoles?: UserRole[] 
}) => {
  const { isAuthenticated, user, isLoading, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p>Please wait while we verify your credentials.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasPermission(requiredRoles)) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="mb-4">
              You don't have the required permissions to access this page. This area is restricted to {requiredRoles.join(' or ')} roles.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  return <Outlet />;
};

// Guest only route (redirect if authenticated)
const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

// App Router
const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      {/* Public routes */}
      <Route path="/" element={<DashboardPage />} />
      <Route path="/bans" element={<BansListPage />} />
      <Route path="/bans/:id" element={<BanDetailsPage />} />
      
      {/* Guest-only routes */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      
      {/* Protected routes (any authenticated user) */}
      <Route element={<ProtectedRoute />}>
        {/* Routes here available to any authenticated user */}
      </Route>
      
      {/* Admin/Moderator routes */}
      <Route element={<ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.MODERATOR]} />}>
        <Route path="/bans/create" element={<CreateBanPage />} />
        <Route path="/appeals" element={<AppealsListPage />} />
        <Route path="/appeals/:id" element={<AppealDetailsPage />} />
      </Route>
      
      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

export default Router;