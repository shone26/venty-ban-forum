// src/pages/dashboard/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { Ban, Appeal, BanStatus, AppealStatus } from '../../types';
import { getBans } from '../../api/bans';

import { useAuth } from '../../hooks/useAuth';
import { getAppeals } from '../../api/apeals';

const DashboardPage: React.FC = () => {
  const { isAuthenticated, hasPermission } = useAuth();
  const [recentBans, setRecentBans] = useState<Ban[]>([]);
  const [pendingAppeals, setPendingAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    totalActiveBans: 0,
    totalAppeals: 0,
    totalAppealsPending: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent bans
        const bansResponse = await getBans({ 
          limit: 5, 
          sortBy: 'createdAt', 
          sortOrder: 'desc' 
        });
        setRecentBans(bansResponse.bans);

        // Calculate stats
        const activeBansResponse = await getBans({ status: BanStatus.ACTIVE });
        setStats(prev => ({ ...prev, totalActiveBans: activeBansResponse.total }));

        // Fetch appeals if user has permission
        if (isAuthenticated && hasPermission(['admin', 'moderator'])) {
          const appealsResponse = await getAppeals({
            status: AppealStatus.PENDING,
            limit: 5,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          });
          setPendingAppeals(appealsResponse.appeals);
          
          // Update stats with appeals data
          setStats(prev => ({ 
            ...prev, 
            totalAppeals: appealsResponse.total,
            totalAppealsPending: appealsResponse.appeals.filter(a => a.status === AppealStatus.PENDING).length
          }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, hasPermission]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900">Active Bans</h2>
          <p className="mt-2 text-3xl font-bold text-primary-600">{stats.totalActiveBans}</p>
          <div className="mt-4">
            <Link 
              to="/bans" 
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all bans →
            </Link>
          </div>
        </Card>

        {isAuthenticated && hasPermission(['admin', 'moderator']) && (
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Pending Appeals</h2>
            <p className="mt-2 text-3xl font-bold text-amber-500">{stats.totalAppealsPending}</p>
            <div className="mt-4">
              <Link 
                to="/appeals" 
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all appeals →
              </Link>
            </div>
          </Card>
        )}

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900">Check Status</h2>
          <p className="mt-2 text-sm text-gray-500">
            Verify if a player is currently banned from the server.
          </p>
          <div className="mt-4">
            <Link to="/bans">
              <Button variant="outline" size="sm">
                Check Ban Status
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Bans */}
      <Card>
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Bans</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentBans.length > 0 ? (
            recentBans.map((ban) => (
              <div key={ban._id} className="px-6 py-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium">
                      <Link to={`/bans/${ban._id}`} className="text-primary-600 hover:text-primary-500">
                        {ban.playerName}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {ban.reason.length > 100 ? ban.reason.substring(0, 100) + '...' : ban.reason}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ban.status === BanStatus.ACTIVE 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {ban.status.charAt(0).toUpperCase() + ban.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(ban.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              No recent bans found.
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Link 
            to="/bans" 
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View all bans →
          </Link>
        </div>
      </Card>

      {/* Pending Appeals - Only for admins/moderators */}
      {isAuthenticated && hasPermission(['admin', 'moderator']) && (
        <Card>
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Pending Appeals</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingAppeals.length > 0 ? (
              pendingAppeals.map((appeal) => (
                <div key={appeal._id} className="px-6 py-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium">
                        <Link to={`/appeals/${appeal._id}`} className="text-primary-600 hover:text-primary-500">
                          Appeal from {typeof appeal.appealedBy === 'object' ? appeal.appealedBy.username : 'Unknown'}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {appeal.reason.length > 100 ? appeal.reason.substring(0, 100) + '...' : appeal.reason}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Pending
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {new Date(appeal.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-4 text-center text-gray-500">
                No pending appeals found.
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Link 
              to="/appeals" 
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all appeals →
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;