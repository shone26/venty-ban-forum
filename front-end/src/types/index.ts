// src/types/index.ts
export enum BanStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    APPEALED = 'appealed',
    REVOKED = 'revoked',
  }
  
  export enum BanDuration {
    TEMPORARY = 'temporary',
    PERMANENT = 'permanent',
  }
  
  export enum AppealStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
  }
  
  export enum UserRole {
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    USER = 'user',
  }
  
  export interface Ban {
    _id: string;
    playerName: string;
    steamId: string;
    discordId?: string;
    ipAddress?: string;
    reason: string;
    evidence: string;
    evidencePhotos: string[]; // Array of photo URLs
    durationType: BanDuration;
    expiresAt?: string;
    status: BanStatus;
    bannedBy: User | string;
    notes?: string;
    appeals?: Appeal[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface User {
    _id: string;
    clerkId: string;
    username: string;
    email: string;
    roles: UserRole[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Appeal {
    _id: string;
    ban: Ban | string;
    reason: string;
    evidence: string;
    evidencePhotos?: string[]; // Array of photo URLs 
    status: AppealStatus;
    appealedBy: User | string;
    reviewedBy?: User | string;
    reviewNotes?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface BanQueryParams {
    page?: number;
    limit?: number;
    status?: BanStatus;
    search?: string;
    steamId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
  export interface AppealQueryParams {
    page?: number;
    limit?: number;
    status?: AppealStatus;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
  export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
  }
  
  export type BansResponse = PaginatedResponse<Ban> & { bans: Ban[] };
  export type AppealsResponse = PaginatedResponse<Appeal> & { appeals: Appeal[] };