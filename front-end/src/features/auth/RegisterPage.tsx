// src/features/auth/pages/RegisterPage.tsx
import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';


const RegisterPage: React.FC = () => {
  return (  
    <div className="flex justify-center items-center">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;