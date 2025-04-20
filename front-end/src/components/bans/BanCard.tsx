import React from 'react';
import { Calendar, Clock, User, Shield, ExternalLink, MoreHorizontal } from 'lucide-react';

// Sample ban data - replace with your actual data structure
const ban = {
  _id: 'ban123',
  playerName: 'XxGamer123',
  playerId: 'STEAM_0:1:12345678',
  reason: 'Using unauthorized mods to gain unfair advantages. Player was observed flying vehicles and teleporting across the map.',
  evidence: 'https://youtube.com/watch?v=example',
  adminName: 'Admin_Jefferson',
  createdAt: new Date('2023-07-15T10:30:00'),
  expiresAt: new Date('2023-08-15T10:30:00'), // Set to null for permanent ban
  isActive: true,
  notes: 'Player has previous violations and was warned twice before.'
};

// Function to determine if a ban is expired
const isBanExpired = (ban) => {
  if (!ban.expiresAt) return false; // Permanent bans don't expire
  return new Date(ban.expiresAt) < new Date();
};

const ModernBanCard = () => {
  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'Permanent';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate time remaining or time since expiration
  const getTimeRemaining = (expiresAt) => {
    if (!expiresAt) return 'Permanent';
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry - now;
    
    // If already expired
    if (diffMs < 0) {
      const days = Math.abs(Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      return `Expired ${days} days ago`;
    }
    
    // Not yet expired
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };

  // Determine status badge style
  const getStatusBadge = () => {
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

  const status = getStatusBadge();

  return (
    <div className="max-w-lg w-full mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        {/* Card Header */}
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield size={18} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">Ban Record</h3>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
            {status.label}
          </div>
        </div>
        
        {/* Player Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{ban.playerName}</h3>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <User size={14} className="mr-1" />
                <span>{ban.playerId}</span>
              </div>
            </div>
            
            <button className="p-1 rounded-full hover:bg-gray-100">
              <MoreHorizontal size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Ban Details */}
        <div className="p-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Reason</h4>
            <p className="text-gray-800">{ban.reason}</p>
          </div>
          
          {ban.evidence && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Evidence</h4>
              <a 
                href={ban.evidence} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
              >
                <ExternalLink size={14} className="mr-1" />
                View Evidence
              </a>
            </div>
          )}
          
          {/* Time Information */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Created</h4>
              <div className="flex items-center text-sm text-gray-800">
                <Calendar size={14} className="mr-2 text-gray-500" />
                {formatDate(ban.createdAt)}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Expires</h4>
              <div className="flex items-center text-sm text-gray-800">
                <Clock size={14} className="mr-2 text-gray-500" />
                {formatDate(ban.expiresAt)}
              </div>
              
              {ban.expiresAt && ban.isActive && (
                <div className={`text-xs mt-1 ${isBanExpired(ban) ? 'text-green-600' : 'text-yellow-600'}`}>
                  {getTimeRemaining(ban.expiresAt)}
                </div>
              )}
            </div>
          </div>
          
          {/* Admin Info */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-600">
                <Shield size={14} className="mr-1 text-gray-500" />
                Ban by {ban.adminName}
              </div>
              
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs font-medium text-blue-700 hover:text-blue-800 rounded-md hover:bg-blue-50">
                  Edit
                </button>
                <button className="px-3 py-1 text-xs font-medium text-red-700 hover:text-red-800 rounded-md hover:bg-red-50">
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernBanCard;