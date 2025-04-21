// src/context/ClerkProvider.tsx
import { ClerkProvider as ClerkProviderOriginal } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { ReactNode, useEffect } from 'react';

interface ClerkProviderProps {
  children: ReactNode;
}

const ClerkProvider = ({ children }: ClerkProviderProps) => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  useEffect(() => {
    // Listen for authentication token changes
    const handleClerkTokenChange = async () => {
      const tokens = JSON.parse(localStorage.getItem('clerk-tokens') || '{}');
      if (tokens?.jwt) {
        localStorage.setItem('clerk-auth-token', tokens.jwt);
      } else {
        localStorage.removeItem('clerk-auth-token');
      }
    };

    window.addEventListener('clerk-tokens', handleClerkTokenChange);
    
    // Initial token check
    handleClerkTokenChange();

    return () => {
      window.removeEventListener('clerk-tokens', handleClerkTokenChange);
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
      appearance={{
        baseTheme: dark,
        elements: {
          card: 'shadow-xl border border-gray-700 rounded-lg',
          formButtonPrimary: 'bg-primary-600 hover:bg-primary-700',
          formFieldInput: 'bg-gray-800 border-gray-700 text-white',
          footerActionLink: 'text-primary-500 hover:text-primary-400',
        },
      }}
    >
      {children}
    </ClerkProviderOriginal>
  );
};

export default ClerkProvider;