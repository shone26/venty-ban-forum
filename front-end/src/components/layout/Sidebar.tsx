// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();

  // Mobile sidebar only shows on small screens
  const mobileSidebarClasses = isOpen
    ? 'fixed inset-0 z-40 flex lg:hidden'
    : 'hidden';

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div className={`${mobileSidebarClasses}`}>
        {/* Backdrop overlay */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Sidebar content */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
          {/* Close button */}
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onClose}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Nav content */}
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <SidebarContent />
          </div>
        </div>

        <div className="flex-shrink-0 w-14">
          {/* Force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Desktop sidebar (always visible on large screens) */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-gray-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <SidebarContent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Shared sidebar content for mobile and desktop
const SidebarContent: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <>
      {/* Logo */}
      <div className="flex items-center flex-shrink-0 px-4">
        <h2 className="text-xl font-bold text-white">GTA RP Ban System</h2>
      </div>
      
      {/* Navigation */}
      <nav className="mt-6 flex-1 px-2 space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <svg
            className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Dashboard
        </NavLink>

        <NavLink
          to="/bans"
          className={({ isActive }) =>
            `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <svg
            className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Bans
        </NavLink>

        {currentUser && ['admin', 'moderator'].includes(currentUser.role) && (
          <NavLink
            to="/bans/create"
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <svg
              className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            New Ban
          </NavLink>
        )}

        {currentUser && currentUser.role === 'admin' && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <svg
              className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Users
          </NavLink>
        )}
      </nav>

      {/* User info */}
      {currentUser && (
        <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
          <div className="flex items-center">
            <div>
              <div className="h-9 w-9 rounded-full bg-gray-500 flex items-center justify-center">
                <span className="text-white font-medium">
                  {currentUser.displayName?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white truncate">
                {currentUser.displayName}
              </p>
              <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200 uppercase">
                {currentUser.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;