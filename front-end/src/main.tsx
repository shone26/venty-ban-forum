// src/main.tsx
import './index.css'
import './assets/styles/tailwind-output.css' // Make sure this path is correct
import './assets/styles/global.scss' // Import your global styles

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';

// Layouts
import Layout from './components/layout/Layout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import DashboardPage from './features/dashboard/pages/DashboardPage';
import BansListPage from './pages/bans/BansListPage';
import BanDetailsPage from './pages/bans/BanDetailsPage';
import CreateBanPage from './pages/bans/CreateBanPage';

import NotFoundPage from './pages/NotFoundPage';

// Context Providers
import { AuthProvider } from './context/AuthContext';

import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';

// Define the router with TypeScript
const router = createBrowserRouter([
  // Auth routes
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { 
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        index: true,
        element: <LoginPage />, // Redirect root to login page
      },
    ],
  },
  // Main app routes
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "bans",
        element: <BansListPage />,
      },
      {
        path: "bans/create",
        element: <CreateBanPage />,
      },
      {
        path: "bans/:id",
        element: <BanDetailsPage />,
      },
    ],
  },
  // 404 page
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

// Add non-null assertion for getElementById since TypeScript needs this guarantee
const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
  
        <RouterProvider router={router} />

    </AuthProvider>
  </React.StrictMode>
);