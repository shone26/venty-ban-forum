import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ban } from '../../api/types';
import { Card } from '../common/Card';
import { BanStatusBadge } from './BanStatusBadge';
import { Spinner } from '../common/Spinner';
import BanApi from '../../api/bans';
import { formatDate } from '../../utils/formatDate';

interface BanHistoryProps {
  steamId: string;
  currentBanId?: string;
  className?: string;
}

export const BanHistory: React.FC<BanHistoryProps> = ({
  steamId,
  currentBanId,
  className = '',
}) => {
  const [banHistory, setBanHistory] = useState<Ban[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch ban history for the player
  useEffect(() => {
    const fetchBanHistory = async () => {
      if (!steamId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const history = await BanApi.getBanHistoryBySteamId(steamId, currentBanId);
        setBanHistory(history);
      } catch (err) {
        console.error('Error fetching ban history:', err);
        setError('Failed to load ban history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBanHistory();
  }, [steamId, currentBanId]);
  
  // If no Steam ID, show empty state
  if (!steamId) {
    return null;
  }
  
  return (
    <Card className={className}>
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Ban History</h3>
        
        {loading ? (
          <div className="py-4">
            <Spinner size="md" />
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : banHistory.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No previous bans found for this player
          </div>
        ) : (
          <div className="space-y-3">
            {banHistory.map((ban) => (
              <div
                key={ban._id}
                className="border border-gray-200 rounded-md p-3 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start mb-1">
                  <Link
                    to={`/bans/${ban._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {formatDate(ban.createdAt)}
                  </Link>
                  <BanStatusBadge status={ban.status} />
                </div>
                <p className="text-sm text-gray-700 mb-1 line-clamp-2">{ban.reason}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {ban.durationType === 'permanent'
                      ? 'Permanent Ban'
                      : ban.expiresAt
                      ? `Expires: ${formatDate(ban.expiresAt)}`
                      : 'Temporary Ban'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};