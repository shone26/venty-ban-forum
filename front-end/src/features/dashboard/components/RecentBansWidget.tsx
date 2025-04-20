// src/features/dashboard/components/RecentBansWidget.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Ban } from '../../../interfaces/Ban';

interface RecentBansWidgetProps {
  bans: Ban[];
}

const RecentBansWidget: React.FC<RecentBansWidgetProps> = ({ bans }) => {
  // Format date
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  // Get status class and text
  const getStatusBadge = (ban: Ban) => {
    if (!ban.isActive) {
      return (
        <span className="bg-gray-200 text-gray-800 py-1 px-2 rounded-full text-xs font-medium">
          Inactive
        </span>
      );
    }

    if (!ban.expiresAt) {
      return (
        <span className="bg-red-100 text-red-800 py-1 px-2 rounded-full text-xs font-medium">
          Permanent
        </span>
      );
    }

    const now = new Date();
    const expiry = new Date(ban.expiresAt);

    if (expiry < now) {
      return (
        <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs font-medium">
          Expired
        </span>
      );
    }

    return (
      <span className="bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full text-xs font-medium">
        Active
      </span>
    );
  };

  if (bans.length === 0) {
    return <p className="text-gray-500 text-center py-6">No bans recorded yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Player
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Reason
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              By
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bans.map((ban) => (
            <tr key={ban._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link to={`/bans/${ban._id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                  {ban.playerName}
                </Link>
                <div className="text-xs text-gray-500">{ban.playerId}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 line-clamp-1">
                  {ban.reason}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{ban.adminName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{formatDate(ban.createdAt)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(ban)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentBansWidget;