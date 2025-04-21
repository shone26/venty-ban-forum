// src/pages/auth/LoginPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import Card from '../../components/common/Card';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            GTA RP Ban Forum
          </h2>
        </Link>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to manage bans and appeals
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 sm:px-10">
          <SignIn
            routing="path"
            path="/login"
            redirectUrl="/"
            signUpUrl="/register"
          />
        </Card>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-primary-600 hover:text-primary-500">
            Return to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;