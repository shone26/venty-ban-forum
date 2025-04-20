// src/components/auth/RegisterForm.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useForm } from '../../hooks/useForm';
import { validateRegistrationForm } from '../../utils/validators';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: {
      email: '',
      password: '',
      displayName: '',
    },
    validate: validateRegistrationForm,
    onSubmit: async (values) => {
      setError(null);
      try {
        await register(values.email, values.password, values.displayName);
        navigate('/dashboard');
      } catch (err: any) {
        console.error('Registration error:', err);
        let errorMessage = 'Failed to register';
        
        // Firebase auth error handling
        if (err.code === 'auth/email-already-in-use') {
          errorMessage = 'Email is already in use';
        } else if (err.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address';
        } else if (err.code === 'auth/weak-password') {
          errorMessage = 'Password is too weak';
        }
        
        setError(errorMessage);
      }
    },
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600 mt-2">GTA RP Ban Management System</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="displayName" className="block text-gray-700 font-medium mb-2">
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            name="displayName"
            value={values.displayName}
            onChange={handleChange}
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.displayName ? 'border-red-500' : ''
            }`}
          />
          {errors.displayName && (
            <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.password ? 'border-red-500' : ''
            }`}
          />
          {errors.password ? (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          ) : (
            <p className="text-gray-500 text-xs mt-1">
              Password must be at least 8 characters and contain at least one letter and one number.
            </p>
          )}
        </div>

        <div className="mb-6">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </div>

        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;