// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// Pages
import BanListPage from './pages/bans/BanListPage';
import BanDetailsPage from './pages/bans/BanDetailsPage';
import BanFormPage from './pages/bans/BanFormPage';
import AppealListPage from './pages/appeals/AppealListPage';

// Navigation component
const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                Ban Management
              </Link>
            </div>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/bans"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Bans
              </Link>
              <Link
                to="/appeals"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Appeals
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-4 flex items-center md:ml-6">
              <Link
                to="/bans/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Ban
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Footer component
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Ban Management System
          </div>
          <div className="mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Privacy Policy
            </a>
            <span className="mx-2 text-gray-400">|</span>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/bans" />} />
            <Route path="/bans" element={<BanListPage />} />
            <Route path="/bans/create" element={<BanFormPage />} />
            <Route path="/bans/edit/:id" element={<BanFormPage />} />
            <Route path="/bans/:id" element={<BanDetailsPage />} />
            <Route path="/appeals" element={<AppealListPage />} />
            <Route path="*" element={<Navigate to="/bans" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;