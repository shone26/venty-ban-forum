import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, Users, Clock, AlertTriangle, Activity, Eye } from 'lucide-react';

// Sample data - replace with your actual data
const stats = {
  totalBans: 245,
  activeBans: 128,
  permanentBans: 67,
  expiredBans: 50,
  appealedBans: 32,
  revokedBans: 18
};

const monthlyData = [
  { name: 'Jan', bans: 18 },
  { name: 'Feb', bans: 22 },
  { name: 'Mar', bans: 17 },
  { name: 'Apr', bans: 31 },
  { name: 'May', bans: 24 },
  { name: 'Jun', bans: 30 },
  { name: 'Jul', bans: 19 }
];

const ModernDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">Welcome back, manage your GTA RP Ban system</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center">
            <span className="mr-2">Add New Ban</span>
            <Shield size={16} />
          </button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'bans' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={() => setActiveTab('bans')}
        >
          Bans
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'appeals' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={() => setActiveTab('appeals')}
        >
          Appeals
        </button>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="Total Bans" 
          value={stats.totalBans}
          icon={<Shield className="text-blue-500" />}
          change="+12% from last month"
          positive={true}
        />
        <StatCard 
          title="Active Bans" 
          value={stats.activeBans}
          icon={<Eye className="text-indigo-500" />}
          change="-5% from last month"
          positive={false}
        />
        <StatCard 
          title="Permanent Bans" 
          value={stats.permanentBans}
          icon={<AlertTriangle className="text-red-500" />}
          change="+3% from last month"
          positive={false}
        />
        <StatCard 
          title="Expired Bans" 
          value={stats.expiredBans}
          icon={<Clock className="text-green-500" />}
          change="+8% from last month"
          positive={true}
        />
        <StatCard 
          title="Appealed Bans" 
          value={stats.appealedBans}
          icon={<Activity className="text-yellow-500" />}
          change="+15% from last month"
          positive={false}
        />
        <StatCard 
          title="Revoked Bans" 
          value={stats.revokedBans}
          icon={<Users className="text-purple-500" />}
          change="-2% from last month"
          positive={true}
        />
      </div>
      
      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Ban Trend</h3>
          <select className="border border-gray-300 rounded-md text-sm px-2 py-1">
            <option>Last 7 months</option>
            <option>Last 12 months</option>
            <option>This year</option>
          </select>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bans" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          <button className="text-blue-600 text-sm hover:text-blue-800">View All</button>
        </div>
        
        <div className="space-y-4">
          <ActivityItem 
            action="Ban added" 
            target="XxGamer123" 
            time="15 minutes ago" 
            admin="Admin_Jefferson"
            description="Permanent ban for using cheats"
          />
          <ActivityItem 
            action="Ban appealed" 
            target="SkyFall_77" 
            time="2 hours ago" 
            admin="ModeratorSam"
            description="Player claims mistaken identity"
          />
          <ActivityItem 
            action="Ban expired" 
            target="RacerDude99" 
            time="1 day ago" 
            admin="System"
            description="7-day temporary ban expired"
          />
          <ActivityItem 
            action="Ban revoked" 
            target="GameMaster456" 
            time="3 days ago" 
            admin="Admin_Jefferson"
            description="Evidence was insufficient"
          />
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, change, positive }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        <p className={`text-xs mt-2 ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </p>
      </div>
      <div className="p-2 rounded-lg bg-gray-50">
        {icon}
      </div>
    </div>
  </div>
);

// Activity Item Component
const ActivityItem = ({ action, target, time, admin, description }) => (
  <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0">
    <div className="p-2 rounded-full bg-blue-100">
      <Activity size={16} className="text-blue-600" />
    </div>
    <div className="flex-1">
      <div className="flex justify-between">
        <p className="text-sm font-medium text-gray-900">
          {action}: <span className="font-bold">{target}</span>
        </p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
      <p className="text-xs text-gray-600 mt-1">{description}</p>
      <p className="text-xs text-gray-500 mt-1">By: {admin}</p>
    </div>
  </div>
);

export default ModernDashboard;