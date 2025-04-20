// src/features/auth/pages/LoginPage.tsx
import React from 'react';
import LoginForm from '../../components/auth/LoginForm';


const LoginPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <LoginForm />
    </div>
  );
};

export default LoginPage;