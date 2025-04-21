import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Import context providers
import { ToastProvider } from './context/ToastContext';
import { ClerkProvider } from '@clerk/clerk-react';

// Import layouts
import { Layout } from './components/layout/Layout';


// Import pages
import Dashboard from './pages/Dashboard/Dashboard';
import BanList from './pages/Bans/BanList';
import BanDetails from './pages/Bans/BanDetails';
import CreateBan from './pages/Bans/CreateBan';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/Auth/SignIn';



// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

// Define routes with the Layout wrapper
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },


  {
    element: <ProtectedRoute />,
    children: [
      {
      path: "/",
      element: <Layout />,
      children: [
        

          {
          index: true,
          element: <Dashboard />
        },
        {
          path: "bans",
          element: <BanList />
        },
        {
          path: "bans/:id",
          element: <BanDetails />
        },
        {
          path: "bans/create",
          element: <CreateBan />
        },
        {
          path: "appeals",
          element: <div>Appeals Page (Coming Soon)</div>
        }
      ]
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
    <ToastProvider>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/login"
        afterSignInUrl="/"
      >
        <RouterProvider router={router} />
      </ClerkProvider>
    </ToastProvider>
  </React.StrictMode>
);