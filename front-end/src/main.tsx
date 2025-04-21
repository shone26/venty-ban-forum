// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';

// Import context providers
import { ToastProvider } from './context/ToastContext';

// Import layouts
import { Layout } from './components/layout/Layout';

// Import components
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Import pages
import Dashboard from './pages/Dashboard/Dashboard';
import BanList from './pages/Bans/BanList';
import BanDetails from './pages/Bans/BanDetails';
import CreateBan from './pages/Bans/CreateBan';
import NotFound from './pages/NotFound';

import SignIn from './pages/Auth/SignIn';
import Unauthorized from './pages/Auth/Unauthorized';


// Clerk Publishable Key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Define routes with the Layout wrapper
const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignIn />
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "bans",
        element: (
          <ProtectedRoute adminOnly={true}>
            <BanList />
          </ProtectedRoute>
        )
      },
      {
        path: "bans/:id",
        element: (
          <ProtectedRoute adminOnly={true}>
            <BanDetails />
          </ProtectedRoute>
        )
      },
      {
        path: "bans/create",
        element: (
          <ProtectedRoute adminOnly={true}>
            <CreateBan />
          </ProtectedRoute>
        )
      },
      {
        path: "appeals",
        element: (
          <ProtectedRoute adminOnly={true}>
            <div>Appeals Page (Coming Soon)</div>
          </ProtectedRoute>
        )
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);

// Get the root element and render the app
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ClerkProvider>
  </React.StrictMode>
);