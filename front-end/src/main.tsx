// src/main.tsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import './index.css';

// Layout
import RootLayout from './components/RootLayout';

// Pages
import BanListPage from './pages/bans/BanListPage';
import BanDetailsPage from './pages/bans/BanDetailsPage';
import BanFormPage from './pages/bans/BanFormPage';
import AppealListPage from './pages/appeals/AppealListPage';

// Define the router with TypeScript
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <BanListPage />,
      },
      {
        path: "bans",
        element: <BanListPage />,
      },
      {
        path: "bans/:id",
        element: <BanDetailsPage />,
      },
      {
        path: "bans/create",
        element: <BanFormPage />,
      },
      {
        path: "bans/edit/:id",
        element: <BanFormPage />,
      },
      {
        path: "appeals",
        element: <AppealListPage />,
      },
    ],
  },
]);

// Add non-null assertion for getElementById since TypeScript needs this guarantee
const rootElement = document.getElementById("root") as HTMLElement;
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);