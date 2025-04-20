import React, { useState } from 'react';
import {
  Shield,
  User,
  Calendar,
  Clock,
  AlertTriangle,
  FileText,
  ExternalLink,
  Edit,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  MessageSquare,
  Send
} from 'lucide-react';

// Sample ban data - replace with your actual data structure
const banData = {
  _id: 'ban123',
  playerName: 'XxGamer123',
  playerId: 'STEAM_0:1:12345678',
  reason: 'Using unauthorized mods to gain unfair advantages. Player was observed flying vehicles and teleporting across the map. Multiple players reported this behavior.',
  evidence: [
    'https://youtube.com/watch?v=example1',
    'https://imgur.com/example2'
  ],
  adminId: 'admin456',
  adminName: 'Admin_Jefferson',
  createdAt: new Date('2023-07-15T10:30:00'),
  expiresAt: new Date('2023-08-15T10:30:00'), // Set to null for permanent ban
  isActive: true,
  notes: 'Player has previous violations and was warned twice before.',
  comments: [
    { 
      id: 'comment1', 
      author: 'Admin_Jefferson', 
      text: 'Initial ban issued after reviewing multiple reports.', 
      createdAt: new Date('2023-07-15T10:35:00'),
      isAdmin: true
    },
    { 
      id: 'comment2', 
      author: 'ModeratorSam', 
      text: 'Additional evidence reviewed. Ban confirmed valid.', 
      createdAt: new Date('2023-07-15T14:22:00'),
      isAdmin: true
    }
  ],
  history: [
    {
      action: 'Ban Created',
      timestamp: new Date('2023-07-15T10:30:00'),
      user: 'Admin_Jefferson'
    },
    {
      action: 'Evidence Added',
      timestamp: new Date('2023-07-15T10:40:00'),
      user: 'Admin_Jefferson'
    },
    {
      action: 'Ban Reviewed',
      timestamp: new Date('2023-07-15T14:20:00'),
      user: 'ModeratorSam'
    }
  ]
};

const ModernBanDetailsPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  
  // Format date for display - improved to handle string dates
  const formatDate = (date) => {
    if (!date) return 'Permanent';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to determine if a ban is expired - improved to handle string dates
  const isBanExpired = (ban) => {
    if (!ban.expiresAt) return false; // Permanent bans don't expire
    const expiryDate = typeof ban.expiresAt === 'string' ? 
      new Date(ban.expiresAt) : ban.expiresAt;
    return expiryDate < new Date();
  };

  // Calculate time remaining or time since expiration
  const getTimeRemaining = (expiresAt) => {
    if (!expiresAt) return 'Permanent';
    
    const now = new Date();
    const expiry = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
    const diffMs = expiry - now;
    
    // If already expired
    if (diffMs < 0) {
      const days = Math.abs(Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      return `Expired ${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
    // Not yet expired
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };

  // Determine status badge style
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

  const handleAddComment = (e) => {
    e.preventDefault();
    // Here you would implement the actual comment submission
    console.log('Adding comment:', commentText);
    setCommentText('');
  };

  const status = getStatusBadge(banData);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield size={24} className="text-blue-600 mr-2" />
            Ban Details
          </h1>
          <p className="text-gray-500 mt-1">Viewing ban record for {banData.playerName}</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </button>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Ban'}
          </button>
          
          <div className="relative">
            <button className="px-2 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white hover:bg-gray-50">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        {/* Ban Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 font-bold text-lg">
                  {banData.playerName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900">{banData.playerName}</h2>
                <div className="flex items-center text-sm text-gray-600">
                  <User size={14} className="mr-1" />
                  <span>{banData.playerId}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text} mr-3`}>
                {status.label}
              </span>
              
              {banData.expiresAt && banData.isActive && (
                <span className={`text-sm ${isBanExpired(banData) ? 'text-green-600' : 'text-yellow-600'}`}>
                  {getTimeRemaining(banData.expiresAt)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 border-b-2 text-sm font-medium ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-6 py-3 border-b-2 text-sm font-medium ${
                activeTab === 'comments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Comments ({banData.comments ? banData.comments.length : 0})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 border-b-2 text-sm font-medium ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              History
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div>
              {/* Ban Reason */}
              <div className="mb-8">
                <h3 className="text-base font-medium text-gray-900 flex items-center mb-2">
                  <AlertTriangle size={16} className="mr-2 text-yellow-500" />
                  Ban Reason
                </h3>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-line">{banData.reason}</p>
                </div>
              </div>
              
              {/* Evidence */}
              {banData.evidence && banData.evidence.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-base font-medium text-gray-900 flex items-center mb-2">
                    <FileText size={16} className="mr-2 text-blue-500" />
                    Evidence
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <ul className="space-y-2">
                      {banData.evidence.map((url, index) => (
                        <li key={index} className="flex items-center">
                          <ExternalLink size={14} className="mr-2 text-gray-500" />
                          <a 
                            href={url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Additional Notes */}
              {banData.notes && (
                <div className="mb-8">
                  <h3 className="text-base font-medium text-gray-900 flex items-center mb-2">
                    <MessageSquare size={16} className="mr-2 text-purple-500" />
                    Additional Notes
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line">{banData.notes}</p>
                  </div>
                </div>
              )}
              
              {/* Timing Info */}
              <div className="mb-8">
                <h3 className="text-base font-medium text-gray-900 mb-2">Time Information</h3>
                <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    <div className="p-4">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Calendar size={14} className="mr-2 text-gray-500" />
                        Created On
                      </div>
                      <p className="text-gray-900 font-medium">{formatDate(banData.createdAt)}</p>
                      <p className="text-xs text-gray-500 mt-1">By {banData.adminName}</p>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Clock size={14} className="mr-2 text-gray-500" />
                        Expires On
                      </div>
                      <p className="text-gray-900 font-medium">
                        {banData.expiresAt ? formatDate(banData.expiresAt) : 'Never (Permanent Ban)'}
                      </p>
                      {banData.expiresAt && banData.isActive && (
                        <p className={`text-xs mt-1 ${isBanExpired(banData) ? 'text-green-600' : 'text-yellow-600'}`}>
                          {getTimeRemaining(banData.expiresAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ban Actions */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-base font-medium text-gray-900 mb-2">Actions</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md flex items-center hover:bg-yellow-200">
                      <Edit size={16} className="mr-2" />
                      Edit Ban
                    </button>
                    
                    {banData.isActive ? (
                      <button className="px-4 py-2 bg-red-100 text-red-800 rounded-md flex items-center hover:bg-red-200">
                        <XCircle size={16} className="mr-2" />
                        Revoke Ban
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-green-100 text-green-800 rounded-md flex items-center hover:bg-green-200">
                        <CheckCircle size={16} className="mr-2" />
                        Reinstate Ban
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div>
              <div className="space-y-4 mb-6">
                {banData.comments && banData.comments.length > 0 ? (
                  banData.comments.map((comment) => (
                    <div 
                      key={comment.id} 
                      className={`bg-gray-50 p-4 rounded-md border ${comment.isAdmin ? 'border-blue-200' : 'border-gray-200'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full ${comment.isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'} flex items-center justify-center`}>
                            <span className="font-bold text-sm">
                              {comment.author.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{comment.author}</p>
                            <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          {comment.isAdmin && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Staff</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-gray-700 whitespace-pre-line">{comment.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No comments yet
                  </div>
                )}
              </div>
              
              {/* Add Comment Form */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-base font-medium text-gray-900 mb-2">Add Comment</h3>
                <form onSubmit={handleAddComment}>
                  <textarea
                    className="block w-full p-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows={3}
                    placeholder="Add your comment here..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                  ></textarea>
                  
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Send size={16} className="mr-2" />
                      Add Comment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <div className="space-y-4">
                {banData.history && banData.history.length > 0 ? (
                  banData.history.map((event, index) => (
                    <div key={index} className="relative pl-6 pb-4">
                      {/* Timeline connector */}
                      {index < banData.history.length - 1 && (
                        <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-gray-200"></div>
                      )}
                      
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                      
                      {/* Event content */}
                      <div className="bg-white border border-gray-200 rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-gray-900">{event.action}</p>
                          <p className="text-xs text-gray-500">{formatDate(event.timestamp)}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">By {event.user}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No history records available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernBanDetailsPage;