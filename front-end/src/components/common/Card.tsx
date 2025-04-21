// src/components/common/Card.tsx
import React, { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div 
      className={twMerge(
        'bg-white rounded-lg shadow border border-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;