// src/components/RootLayout.tsx
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ui/ThemeToggle';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };
  
  return (
    <nav className="bg-white dark:bg-dark-bg-secondary border-b border-gray-200 dark:border-dark-border shadow-sm transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900 dark:text-dark-text-primary">
                Ban Management
              </Link>
            </div>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/bans"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/bans') 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' 
                    : 'text-gray-700 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary'
                }`}
              >
                Bans
              </Link>
              <Link
                to="/appeals"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/appeals') 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' 
                    : 'text-gray-700 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary'
                }`}
              >
                Appeals
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="ml-4 flex items-center md:ml-6">
              <Link
                to="/bans/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
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

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-dark-bg-secondary border-t border-gray-200 dark:border-dark-border mt-auto transition-colors">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 dark:text-dark-text-secondary text-sm">
            © {new Date().getFullYear()} Ban Management System
          </div>
          <div className="mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <span className="mx-2 text-gray-400 dark:text-gray-600">|</span>
            <a
              href="#"
              className="text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary text-sm transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const RootLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-bg-primary text-gray-900 dark:text-dark-text-primary transition-colors">
      <Navigation />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;