// src/pages/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted,
        or maybe it never existed.
      </p>
      <Link to="/">
        <Button variant="primary">
          Go back home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;