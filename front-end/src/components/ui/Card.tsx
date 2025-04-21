// src/components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-dark-bg-secondary shadow dark:shadow-dark-card rounded-lg border border-gray-100 dark:border-dark-border transition-colors ${className}`}>
      {children}
    </div>
  );
};