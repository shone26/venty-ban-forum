import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ban, Appeal, BanStatus, AppealStatus } from '../../api/types';
import BanApi from '../../api/bans';
import AppealApi from '../../api/appeals';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { BanStatusBadge } from '../../components/bans/BanStatusBadge';
import { getRelativeTime } from '../../utils/formatDate';
import { useToast } from '../../context/ToastContext';

// Stat Card component
interface StatCardProps {
  title: string;
  value: number;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  loading = false,
  icon,
  className = '',
}) => {
  return (
    <Card className={`${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {loading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold">{value}</p>
            )}
          </div>
          {icon && <div className="p-2 bg-gray-100 rounded-full">{icon}</div>}
        </div>
      </div>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const { showToast } = useToast();
  
  // Stats state
  const [stats, setStats] = useState({
    totalActiveBans: 0,
    totalAppeals: 0,
    pendingAppeals: 0,
    expiredBans: 0,
  });
  
  // Recent data state
  const [recentBans, setRecentBans] = useState<Ban[]>([]);
  const [recentAppeals, setRecentAppeals] = useState<Appeal[]>([]);
  
  // Loading states
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRecentBans, setLoadingRecentBans] = useState(true);
  const [loadingRecentAppeals, setLoadingRecentAppeals] = useState(true);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent bans
        setLoadingRecentBans(true);
        const bansResponse = await BanApi.getAllBans({ 
          limit: 5, 
          sortBy: 'createdAt', 
          sortOrder: 'desc' 
        });
        setRecentBans(bansResponse.bans);
        
        // Fetch recent appeals
        setLoadingRecentAppeals(true);
        const appealsResponse = await AppealApi.getAllAppeals({ 
          limit: 5,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        setRecentAppeals(appealsResponse.appeals);
        
        // Calculate stats
        setLoadingStats(true);
        const activeBansResponse = await BanApi.getAllBans({ status: BanStatus.ACTIVE });
        const pendingAppealsResponse = await AppealApi.getAllAppeals({ status: AppealStatus.PENDING });
        const expiredBansResponse = await BanApi.getAllBans({ status: BanStatus.EXPIRED });
        
        setStats({
          totalActiveBans: activeBansResponse.total,
          totalAppeals: appealsResponse.total,
          pendingAppeals: pendingAppealsResponse.total,
          expiredBans: expiredBansResponse.total,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showToast('error', 'Failed to load dashboard data');
      } finally {
        setLoadingStats(false);
        setLoadingRecentBans(false);
        setLoadingRecentAppeals(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return (
    <Layout>
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Active Bans"
            value={stats.totalActiveBans}
            loading={loadingStats}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 015.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            }
          />
          
          <StatCard
            title="Pending Appeals"
            value={stats.pendingAppeals}
            loading={loadingStats}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            }
          />
          
          <StatCard
            title="Total Appeals"
            value={stats.totalAppeals}
            loading={loadingStats}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          
          <StatCard
            title="Expired Bans"
            value={stats.expiredBans}
            loading={loadingStats}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bans */}
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Recent Bans</h2>
                <Link to="/bans" className="text-sm text-blue-600 hover:text-blue-800">
                  View All
                </Link>
              </div>
              
              {loadingRecentBans ? (
                <div className="flex justify-center py-8">
                  <Spinner size="md" />
                </div>
              ) : recentBans.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No recent bans found
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBans.map((ban) => (
                    <Link
                      key={ban._id}
                      to={`/bans/${ban._id}`}
                      className="block border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{ban.playerName}</div>
                          <div className="text-sm text-gray-500">{getRelativeTime(ban.createdAt)}</div>
                        </div>
                        <BanStatusBadge status={ban.status} />
                      </div>
                      <div className="mt-2 text-sm text-gray-600 line-clamp-2">{ban.reason}</div>
                    </Link>
                  ))}
                </div>
              )}
              
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => window.location.href = '/bans/create'}>
                  Create New Ban
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Recent Appeals */}
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Recent Appeals</h2>
                <Link to="/appeals" className="text-sm text-blue-600 hover:text-blue-800">
                  View All
                </Link>
              </div>
              
              {loadingRecentAppeals ? (
                <div className="flex justify-center py-8">
                  <Spinner size="md" />
                </div>
              ) : recentAppeals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No recent appeals found
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAppeals.map((appeal) => (
                    <Link
                      key={appeal._id}
                      to={typeof appeal.ban === 'string' ? `/bans/${appeal.ban}` : `/bans/${appeal.ban._id}`}
                      className="block border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">
                            {typeof appeal.ban === 'object' ? appeal.ban.playerName : 'Unknown Player'}
                          </div>
                          <div className="text-sm text-gray-500">{getRelativeTime(appeal.createdAt)}</div>
                        </div>
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${appeal.status === AppealStatus.APPROVED ? 'bg-green-100 text-green-800 border border-green-200' : 
                            appeal.status === AppealStatus.REJECTED ? 'bg-red-100 text-red-800 border border-red-200' : 
                            'bg-yellow-100 text-yellow-800 border border-yellow-200'}
                        `}>
                          {appeal.status.charAt(0).toUpperCase() + appeal.status.slice(1)}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600 line-clamp-2">{appeal.reason}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;