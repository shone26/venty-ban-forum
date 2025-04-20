import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Shield, 
  Clock, 
  AlertTriangle, 
  User, 
  Calendar,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

// Sample data - replace with your actual data
const banData = [
  {
    _id: 'ban123',
    playerName: 'XxGamer123',
    playerId: 'STEAM_0:1:12345678',
    reason: 'Using unauthorized mods to gain unfair advantages',
    adminName: 'Admin_Jefferson',
    createdAt: new Date('2023-07-15T10:30:00'),
    expiresAt: new Date('2023-08-15T10:30:00'),
    isActive: true,
  },
  {
    _id: 'ban124',
    playerName: 'SkyFall_77',
    playerId: 'STEAM_0:1:87654321',
    reason: 'Harassment and offensive language',
    adminName: 'ModeratorSam',
    createdAt: new Date('2023-07-10T15:45:00'),
    expiresAt: null, // Permanent ban
    isActive: true,
  },
  {
    _id: 'ban125',
    playerName: 'RacerDude99',
    playerId: 'STEAM_0:1:55555555',
    reason: 'Combat logging to avoid roleplay consequences',
    adminName: 'Admin_Jefferson',
    createdAt: new Date('2023-07-05T09:15:00'),
    expiresAt: new Date('2023-07-12T09:15:00'), // Already expired
    isActive: true,
  },
  {
    _id: 'ban126',
    playerName: 'GameMaster456',
    playerId: 'STEAM_0:1:44444444',
    reason: 'Metagaming using information from outside sources',
    adminName: 'ModeratorAlex',
    createdAt: new Date('2023-06-28T12:20:00'),
    expiresAt: new Date('2023-07-28T12:20:00'),
    isActive: false, // Revoked
  }
];

const ModernBanList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [adminFilter, setAdminFilter] = useState('all');
  const [dateSort, setDateSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'Permanent';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Determine if a ban is expired
  const isBanExpired = (ban) => {
    if (!ban.expiresAt) return false; // Permanent bans don't expire
    return new Date(ban.expiresAt) < new Date();
  };

  // Get status text and styling
  const getStatusBadge = (ban) => {
    if (!ban.isActive) {
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: 'Inactive'
      };
    }

    if (!ban.expiresAt) {
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Permanent'
      };
    }

    if (isBanExpired(ban)) {
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Expired'
      };
    }

    return {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Active'
    };
  };

  // Filter and sort bans
  const filteredBans = banData
    .filter(ban => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          ban.playerName.toLowerCase().includes(query) ||
          ban.playerId.toLowerCase().includes(query) ||
          ban.reason.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(ban => {
      // Status filter
      if (statusFilter === 'all') return true;
      if (statusFilter === 'active') return ban.isActive && (!ban.expiresAt || !isBanExpired(ban));
      if (statusFilter === 'permanent') return ban.isActive && !ban.expiresAt;
      if (statusFilter === 'expired') return ban.isActive && ban.expiresAt && isBanExpired(ban);
      if (statusFilter === 'inactive') return !ban.isActive;
      return true;
    })
    .filter(ban => {
      // Admin filter
      if (adminFilter === 'all') return true;
      return ban.adminName === adminFilter;
    })
    .sort((a, b) => {
      // Date sort
      if (dateSort === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

  // Get unique admin names for filter
  const uniqueAdmins = [...new Set(banData.map(ban => ban.adminName))];

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      {/* List Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Player Bans</h1>
          <p className="text-gray-500">Manage and view all player ban records</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-2" />
            Filters
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Shield size={16} className="mr-2" />
            New Ban
          </button>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by player name, ID, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Quick Status Filter */}
          <div className="flex space-x-2">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="permanent">Permanent</option>
              <option value="expired">Expired</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <button 
              className="p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
              onClick={() => setDateSort(dateSort === 'newest' ? 'oldest' : 'newest')}
            >
              {dateSort === 'newest' ? (
                <ChevronDown size={20} className="text-gray-500" />
              ) : (
                <ChevronUp size={20} className="text-gray-500" />
              )}
            </button>
            
            <button className="p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
              <RefreshCw size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin</label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={adminFilter}
                onChange={(e) => setAdminFilter(e.target.value)}
              >
                <option value="all">All Admins</option>
                {uniqueAdmins.map(admin => (
                  <option key={admin} value={admin}>{admin}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option>All Time</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Custom range</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option>Date (newest first)</option>
                <option>Date (oldest first)</option>
                <option>Player name (A-Z)</option>
                <option>Admin name (A-Z)</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Results Info */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{filteredBans.length}</span> results
        </p>
        
        <div className="flex items-center text-sm text-gray-600">
          <SlidersHorizontal size={14} className="mr-1" />
          <span>Filter Settings Applied</span>
        </div>
      </div>
      
      {/* Ban List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Player
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBans.map(ban => {
              const status = getStatusBadge(ban);
              
              return (
                <tr key={ban._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold">
                        {ban.playerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{ban.playerName}</div>
                        <div className="text-sm text-gray-500">{ban.playerId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{ban.reason}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ban.adminName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(ban.createdAt)}</div>
                    {ban.expiresAt && (
                      <div className="text-xs text-gray-400">
                        Expires: {formatDate(ban.expiresAt)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href={`/bans/${ban._id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                      View
                    </a>
                    <button className="text-gray-600 hover:text-gray-900">
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Empty State */}
        {filteredBans.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <Search size={24} className="text-gray-500" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bans found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setAdminFilter('all');
                }}
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border border-gray-200 rounded-lg mt-4 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
              <span className="font-medium">{filteredBans.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronUp className="h-5 w-5 rotate-90" aria-hidden="true" />
              </button>
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-600 hover:bg-gray-50"
              >
                1
              </button>
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                2
              </button>
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                3
              </button>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                8
              </button>
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                9
              </button>
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                10
              </button>
              <button
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <ChevronDown className="h-5 w-5 rotate-90" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernBanList;