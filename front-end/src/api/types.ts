// Type definitions for the API entities that match the NestJS backend

// Authentication-related enums
export enum UserRole {
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    USER = 'user',
  }
  
  // Update User interface to include roles and authentication details
  export interface User {
    clerkId: string;
    username: string;
    email: string;
    roles: UserRole[];
    createdAt: string;
    updatedAt: string;
  }
  
  // Rest of the existing type definitions remain the same
  // Ban-related types
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
  
  export interface Ban {
    _id: string;
    playerName: string;
    steamId: string;
    discordId?: string;
    ipAddress?: string;
    reason: string;
    evidence: string;
    durationType: BanDuration;
    expiresAt?: string;
    status: BanStatus;
    bannedBy: string | User;
    notes?: string;
    appeals: Appeal[] | string[];
    createdAt: string;
    updatedAt: string;
    evidencePaths?: string[]; // For storing paths to evidence images
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
  
  export interface BanResponse {
    bans: Ban[];
    total: number;
    page: number;
    limit: number;
  }
  
  export interface CreateBanDto {
    playerName: string;
    steamId: string;
    discordId?: string;
    ipAddress?: string;
    reason: string;
    evidence: string;
    durationType: BanDuration;
    durationDays?: number;
    notes?: string;
    evidencePaths?: string[];
  }
  
  export interface UpdateBanDto {
    playerName?: string;
    steamId?: string;
    discordId?: string;
    ipAddress?: string;
    reason?: string;
    evidence?: string;
    durationType?: BanDuration;
    durationDays?: number;
    expiresAt?: string;
    status?: BanStatus;
    notes?: string;
    evidencePaths?: string[];
  }
  
  // Appeal-related types
  export enum AppealStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
  }
  
  export interface Appeal {
    _id: string;
    ban: string | Ban;
    reason: string;
    evidence: string;
    status: AppealStatus;
    appealedBy: string | User;
    reviewedBy?: string | User;
    reviewNotes?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AppealQueryParams {
    page?: number;
    limit?: number;
    status?: AppealStatus;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
  export interface AppealResponse {
    appeals: Appeal[];
    total: number;
    page: number;
    limit: number;
  }
  
  export interface CreateAppealDto {
    ban: string;
    reason: string;
    evidence: string;
  }
  
  export interface UpdateAppealDto {
    reason?: string;
    evidence?: string;
    status?: AppealStatus;
    reviewNotes?: string;
  }