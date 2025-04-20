// src/features/dashboard/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Card from '../../../components/common/Card';
import Spinner from '../../../components/common/Spinner';
import Button from '../../../components/common/Button';

// Dashboard components
import StatisticsCard from '../components/StatisticsCard';

import { useAuth } from '../../../context/AuthContext';
import { getAllBans } from '../../../services/api';
import RecentBansWidget from '../components/RecentBansWidget';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalBans: 0,
    activeBans: 0,
    permanentBans: 0,
    expiredBans: 0,
  });
  const [recentBans, setRecentBans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent bans (last 5)
        const response = await getAllBans(1, 5);
        setRecentBans(response.bans);
        
        // Fetch stats (total counts)
        // In a real app, you might want a dedicated API endpoint for stats
        const allBansResponse = await getAllBans(1, 0); // Get all bans for stats (limit 0)
        
        const now = new Date();
        const allBans = allBansResponse.bans;
        
        // Calculate stats
        const activeBans = allBans.filter(ban => 
          ban.isActive && (!ban.expiresAt || new Date(ban.expiresAt) > now)
        );
        
        const permanentBans = allBans.filter(ban => 
          ban.isActive && !ban.expiresAt
        );
        
        const expiredBans = allBans.filter(ban => 
          ban.expiresAt && new Date(ban.expiresAt) <= now
        );
        
        setStats({
          totalBans: allBans.length,
          activeBans: activeBans.length,
          permanentBans: permanentBans.length,
          expiredBans: expiredBans.length,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        
        {currentUser && ['admin', 'moderator'].includes(currentUser.role) && (
          <Link to="/bans/create">
            <Button variant="primary">Add New Ban</Button>
          </Link>
        )}
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatisticsCard
          title="Total Bans"
          value={stats.totalBans}
          icon={
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          }
          color="blue"
        />
        
        <StatisticsCard
          title="Active Bans"
          value={stats.activeBans}
          icon={
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          }
          color="yellow"
        />
        
        <StatisticsCard
          title="Permanent Bans"
          value={stats.permanentBans}
          icon={
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
            </svg>
          }
          color="red"
        />
        
        <StatisticsCard
          title="Expired Bans"
          value={stats.expiredBans}
          icon={
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          }
          color="green"
        />
      </div>
      
      {/* Recent Bans Widget */}
      <div className="mb-8">
        <Card title="Recent Bans">
          <RecentBansWidget bans={recentBans} />
          <div className="mt-4 text-center">
            <Link to="/bans" className="text-blue-600 hover:text-blue-800 font-medium">
              View All Bans
            </Link>
          </div>
        </Card>
      </div>
      
      {/* More dashboard widgets could be added here */}
    </div>
  );
};

export default DashboardPage;