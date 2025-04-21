// src/components/layout/Layout.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../common/Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  // For auth pages, use a simpler layout
  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;