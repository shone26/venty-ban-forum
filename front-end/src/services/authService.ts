// src/services/authService.ts
import api from './api';
import { User } from '../interfaces/User';

/**
 * Get user data by Firebase UID
 */
export const getUserByUid = async (uid: string): Promise<User> => {
  try {
    const response = await api.get(`/auth/users/${uid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Create a new user in the database (after Firebase Auth registration)
 */
export const createUserInDatabase = async (
  uid: string,
  email: string,
  displayName: string
): Promise<User> => {
  try {
    const response = await api.post('/auth/users', {
      uid,
      email,
      displayName,
      role: 'viewer', // Default role for new users
    });
    return response.data;
  } catch (error) {
    console.error('Error creating user in database:', error);
    throw error;
  }
};

/**
 * Update user data
 */
export const updateUser = async (
  uid: string,
  userData: Partial<User>
): Promise<User> => {
  try {
    const response = await api.put(`/auth/users/${uid}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Change user role (admin only)
 */
export const changeUserRole = async (
  uid: string,
  role: 'admin' | 'moderator' | 'viewer'
): Promise<User> => {
  try {
    const response = await api.put(`/auth/users/${uid}/role`, { role });
    return response.data;
  } catch (error) {
    console.error('Error changing user role:', error);
    throw error;
  }
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/auth/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};