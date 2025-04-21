// src/types/index.ts

// Ban Types
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
    bannedBy: User | string;
    notes?: string;
    appeals?: Appeal[];
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
  
  export interface BanListResponse {
    bans: Ban[];
    total: number;
    page: number;
    limit: number;
  }
  
  export interface CreateBanData {
    playerName: string;
    steamId: string;
    discordId?: string;
    ipAddress?: string;
    reason: string;
    evidence: string;
    durationType: BanDuration;
    durationDays?: number;
    notes?: string;
  }
  
  export interface UpdateBanData {
    playerName?: string;
    steamId?: string;
    discordId?: string;
    ipAddress?: string;
    reason?: string;
    evidence?: string;
    durationType?: BanDuration;
    durationDays?: number;
    notes?: string;
    status?: BanStatus;
    expiresAt?: string;
  }
  
  // Appeal Types
  export enum AppealStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
  }
  
  export interface Appeal {
    _id: string;
    ban: Ban | string;
    reason: string;
    evidence: string;
    status: AppealStatus;
    appealedBy: User | string;
    reviewedBy?: User | string;
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
  
  export interface AppealListResponse {
    appeals: Appeal[];
    total: number;
    page: number;
    limit: number;
  }
  
  export interface CreateAppealData {
    ban: string;
    reason: string;
    evidence: string;
  }
  
  export interface UpdateAppealData {
    reason?: string;
    evidence?: string;
    status?: AppealStatus;
    reviewNotes?: string;
  }
  
  // User Types
  export enum UserRole {
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    USER = 'user',
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
  
  // API Response Types
  export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
  }
  
  // Pagination Types
  export interface PaginatedData<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  // Auth Types
  export interface AuthUser {
    userId: string;
    email: string;
    roles: UserRole[];
  }