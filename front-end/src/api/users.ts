// src/api/users.ts
import api from './axios';
import { User, UserRole } from './types';

// Define DTOs
export interface CreateUserDto {
  clerkId: string;
  username: string;
  email: string;
  roles?: UserRole[];
}

// User API endpoints
const UserApi = {
  // Create or update a user
  createUser: async (userData: CreateUserDto): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me', {
      headers: {
        'X-Clerk-ID': localStorage.getItem('clerkId') || '' // Add the clerk ID to header
      }
    });
    console.log("Current user from backend:", response.data);
    return response.data;
  },
};

export default UserApi;