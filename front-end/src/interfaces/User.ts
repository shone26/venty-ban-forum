// src/interfaces/User.ts
export interface User {
    uid: string;          // Firebase Auth UID
    email: string;        // User's email address
    displayName: string;  // User's display name
    role: 'admin' | 'moderator' | 'viewer'; // User role for permissions
    createdAt: Date;      // When the user account was created
    lastLogin?: Date;     // Last login timestamp (optional)
    photoURL?: string;    // Profile photo URL (optional)
  }