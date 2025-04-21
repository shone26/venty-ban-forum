// src/context/ClerkProvider.tsx - Update with proper token handling
import { ClerkProvider as ClerkProviderOriginal } from '@clerk/clerk-react';
import { ReactNode, useEffect } from 'react';

interface ClerkProviderProps {
  children: ReactNode;
}

const ClerkProvider = ({ children }: ClerkProviderProps) => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  useEffect(() => {
    // Properly synchronize Clerk tokens with localStorage
    const handleClerkTokenChange = () => {
      const token = localStorage.getItem('clerk-db-jwt');
      if (token) {
        localStorage.setItem('clerk-auth-token', token);
      } else {
        // Try to get from Clerk's session if available
        const clerkSession = JSON.parse(localStorage.getItem('clerk-session') || '{}');
        if (clerkSession?.jwt) {
          localStorage.setItem('clerk-auth-token', clerkSession.jwt);
        } else {
          localStorage.removeItem('clerk-auth-token');
        }
      }
    };

    window.addEventListener('clerk-session', handleClerkTokenChange);
    
    // Initial token check
    handleClerkTokenChange();

    return () => {
      window.removeEventListener('clerk-session', handleClerkTokenChange);
    };
  }, []);

  if (!clerkPubKey) {
    console.error('Missing Clerk publishable key');
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
          <p>Clerk publishable key is missing. Please check your environment configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProviderOriginal
      publishableKey={clerkPubKey}
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      {children}
    </ClerkProviderOriginal>
  );
};

export default ClerkProvider;