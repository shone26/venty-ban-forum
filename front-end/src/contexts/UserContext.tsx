// src/contexts/UserContext.tsx
import React, { createContext, useContext } from 'react';

const defaultUser = {
  id: 'dev-user',
  username: 'Developer',
  roles: ['admin', 'moderator', 'user']
};

export const UserContext = createContext({
  user: defaultUser,
  hasPermission: (roles: string[]) => true,
  isAuthenticated: true
});

export const useAuth = () => useContext(UserContext);