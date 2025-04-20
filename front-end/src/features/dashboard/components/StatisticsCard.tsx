// src/features/dashboard/components/StatisticsCard.tsx
import React from 'react';

interface StatisticsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'indigo' | 'purple' | 'pink';
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  icon,
  color,
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200',
    indigo: 'bg-indigo-50 border-indigo-200',
    purple: 'bg-purple-50 border-purple-200',
    pink: 'bg-pink-50 border-pink-200',
  };

  return (
    <div className={`rounded-lg border shadow-sm ${colorClasses[color]}`}>
      <div className="p-5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-700">{title}</h2>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div>{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;