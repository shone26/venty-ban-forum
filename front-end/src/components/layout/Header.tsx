import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Shield, 
  HelpCircle, 
  ChevronDown,
  Search,
  Moon,
  Sun
} from 'lucide-react';

const ModernHeader = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Mock user data - replace with your actual auth context
  const user = {
    name: 'Admin Jefferson',
    email: 'admin@gtarp.com',
    role: 'Administrator',
    avatar: null // URL to avatar image or null
  };
  
  // Mock notifications - replace with your actual notifications
  const notifications = [
    {
      id: 1,
      title: 'New ban appeal',
      message: 'SkyFall_77 has submitted an appeal for review',
      time: '5 minutes ago',
      unread: true
    },
    {
      id: 2,
      title: 'Ban expired',
      message: 'Temporary ban for RacerDude99 has expired',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 3,
      title: 'New moderator added',
      message: 'User ModeratorSam has been granted moderator privileges',
      time: '1 day ago',
      unread: false
    }
  ];
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would actually implement dark mode toggle functionality
    // document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and mobile menu */}
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu size={20} />
            </button>
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center ml-0 lg:ml-0">
              <div className="block lg:hidden h-8 w-auto text-blue-600">
                <Shield size={24} className="mr-1" />
              </div>
              <div className="hidden lg:block h-8 w-auto">
                <div className="flex items-center">
                  <Shield size={24} className="text-blue-600 mr-1" />
                  <span className="font-bold text-gray-900">GTA RP Ban System</span>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:ml-6 lg:flex lg:space-x-8">
              <a 
                href="/dashboard" 
                className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </a>
              <a 
                href="/bans" 
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Bans
              </a>
              <a 
                href="/appeals" 
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Appeals
              </a>
              <a 
                href="/users" 
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Users
              </a>
              <a 
                href="/reports" 
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Reports
              </a>
            </nav>
          </div>
          
          {/* Search Bar and Right-side Icons */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            {/* Search */}
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search"
                  type="search"
                />
              </div>
            </div>
            
            {/* Right side icons */}
            <div className="ml-4 flex items-center lg:ml-6">
              {/* Dark mode toggle */}
              <button
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={toggleDarkMode}
              >
                <span className="sr-only">Toggle dark mode</span>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {/* Notifications dropdown */}
              <div className="ml-4 relative">
                <button
                  type="button"
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    if (profileOpen) setProfileOpen(false);
                  }}
                >
                  <span className="sr-only">View notifications</span>
                  <div className="relative">
                    <Bell size={20} />
                    {notifications.some(n => n.unread) && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">
                        {notifications.filter(n => n.unread).length}
                      </span>
                    )}
                  </div>
                </button>
                
                {/* Notification dropdown panel */}
                {notificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Notifications</h3>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <a
                            key={notification.id}
                            href="#"
                            className={`block px-4 py-3 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${notification.unread ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                  <Bell size={16} />
                                </div>
                              </div>
                              <div className="ml-3 w-0 flex-1">
                                <p className={`text-sm font-medium text-gray-900 ${notification.unread ? 'font-semibold' : ''}`}>{notification.title}</p>
                                <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                                <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
                              </div>
                            </div>
                          </a>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No notifications
                        </div>
                      )}
                    </div>
                    <div className="border-t border-gray-100 px-4 py-2">
                      <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500">
                        Mark all as read
                      </a>
                      <span className="mx-2 text-gray-300">|</span>
                      <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500">
                        View all
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="ml-4 relative">
                <div>
                  <button
                    type="button"
                    className="bg-white rounded-full flex text-sm focus:outline-none"
                    onClick={() => {
                      setProfileOpen(!profileOpen);
                      if (notificationsOpen) setNotificationsOpen(false);
                    }}
                  >
                    <span className="sr-only">Open user menu</span>
                    {user.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.avatar}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <ChevronDown size={16} className="ml-1 text-gray-400 self-center" />
                  </button>
                </div>
                
                {/* Profile dropdown panel */}
                {profileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <p className="text-xs font-medium text-blue-600 mt-1">{user.role}</p>
                    </div>
                    
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <User size={16} className="mr-2 text-gray-500" />
                      Your Profile
                    </a>
                    
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Settings size={16} className="mr-2 text-gray-500" />
                      Settings
                    </a>
                    
                    <a
                      href="/help"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <HelpCircle size={16} className="mr-2 text-gray-500" />
                      Help & Documentation
                    </a>
                    
                    <div className="border-t border-gray-100 mt-1"></div>
                    
                    <a
                      href="/logout"
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut size={16} className="mr-2 text-red-500" />
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on mobile menu state */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white">
          <div className="pt-2 pb-3 space-y-1">
            <a
              href="/dashboard"
              className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Dashboard
            </a>
            <a
              href="/bans"
              className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Bans
            </a>
            <a
              href="/appeals"
              className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Appeals
            </a>
            <a
              href="/users"
              className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Users
            </a>
            <a
              href="/reports"
              className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Reports
            </a>
          </div>
          
          {/* Mobile profile section */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                {user.avatar ? (
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.avatar}
                    alt={user.name}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user.name}</div>
                <div className="text-sm font-medium text-gray-500">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <a
                href="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Your Profile
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Settings
              </a>
              <a
                href="/help"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Help & Documentation
              </a>
              <a
                href="/logout"
                className="block px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ModernHeader;