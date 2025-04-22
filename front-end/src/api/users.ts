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
    console.log('Creating/updating user with data:', userData);
    try {
      const response = await api.post('/users', userData);
      console.log('User creation/update successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in createUser API call:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const clerkId = localStorage.getItem('clerkId');
    console.log('Getting current user with clerkId:', clerkId);
    
    if (!clerkId) {
      console.error('No clerkId found in localStorage');
      throw new Error('No user authentication information available');
    }
    
    try {
      // Set the Clerk ID in the request headers
      const response = await api.get('/users/me', {
        headers: {
          'X-Clerk-ID': clerkId
        }
      });
      
      console.log('Current user response from backend:', response.data);
      
      // Check if the roles property exists
      if (!response.data.roles) {
        console.warn('User has no roles defined:', response.data);
      } else {
        console.log('User roles:', response.data.roles);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error in getCurrentUser API call:', error);
      throw error;
    }
  },
};

export default UserApi;