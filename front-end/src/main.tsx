// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Import context providers
import { ToastProvider } from './context/ToastContext';

// Import layouts
import { Layout } from './components/layout/Layout';

// Import pages
import Dashboard from './pages/Dashboard/Dashboard';
import BanList from './pages/Bans/BanList';
import BanDetails from './pages/Bans/BanDetails';
import CreateBan from './pages/Bans/CreateBan';
import NotFound from './pages/NotFound';

// Define routes with the Layout wrapper
const router = createBrowserRouter([
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
      <RouterProvider router={router} />
    </ToastProvider>
  </React.StrictMode>
);