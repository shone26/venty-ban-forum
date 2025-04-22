import React, { useState } from 'react';
import { SignOutButton, useUser } from '@clerk/clerk-react';
import { Button } from '../common/Button';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();
  
  const navigationItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Bans', path: '/bans' },
    { name: 'Create Ban', path: '/bans/create' },
    { name: 'Appeals', path: '/appeals' },
  ];
  
  return (
    <header className="bg-navy-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
         {/* Logo and Title container */}
         <div className="flex items-center space-x-2">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img 
                src={logo} 
                alt="VENTY Roleplay" 
                className="h-8 sm:h-10 w-auto" 
              />
            </Link>
            
            {/* Title */}
            <Link to="/" className="text-white font-bold text-xl hidden sm:block">
              Venty City Ban Forum
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-6 flex-grow justify-center">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>
          
          {/* User and Logout section */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user.profileImageUrl && (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
                    />
                  )}
                  <span className="text-gray-300 text-sm">
                    {user.username || user.fullName ||  user.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
                <SignOutButton>
                  <Button 
                    variant="danger" 
                    size="sm"
                  >
                    Logout
                  </Button>
                </SignOutButton>
              </div>
            )}
          
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon when menu is closed */}
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* Icon when menu is open */}
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          
          {/* Mobile logout */}
          {user && (
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  {user.profileImageUrl && (
                    <img 
                      className="h-10 w-10 rounded-full object-cover border-2 border-gray-600" 
                      src={user.profileImageUrl} 
                      alt="User profile" 
                    />
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {user.fullName || user.username || 'User'}
                  </div>
                  <div className="text-sm font-medium text-gray-400">
                    {user.primaryEmailAddress?.emailAddress}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2">
                <SignOutButton>
                  <Button 
                    variant="danger" 
                    fullWidth
                  >
                    Logout
                  </Button>
                </SignOutButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};