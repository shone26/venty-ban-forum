// src/interfaces/Ban.ts
export interface Ban {
    _id?: string;
    playerId: string; // Steam ID, Discord ID, etc.
    playerName: string;
    reason: string;
    evidence?: string; // URLs to screenshots or videos
    adminId: string;
    adminName: string;
    createdAt: Date;
    expiresAt?: Date; // null/undefined for permanent bans
    notes?: string;
    isActive: boolean;
  }
  
  // src/interfaces/User.ts
  export interface User {
    uid: string; // Firebase Auth UID
    email: string;
    displayName: string;
    role: 'admin' | 'moderator' | 'viewer';
    createdAt: Date;
  }