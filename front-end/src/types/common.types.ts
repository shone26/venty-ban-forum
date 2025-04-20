
// src/types/common.types.ts

export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    avatar?: string;
    createdAt: Date;
    lastLogin?: Date;
    isActive: boolean;
  }
  
  export enum UserRole {
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    SUPPORT = 'support',
    VIEWER = 'viewer'
  }
  
  export enum BanStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    APPEALED = 'appealed',
    REVOKED = 'revoked'
  }
  
  export enum BanType {
    PERMANENT = 'permanent',
    TEMPORARY = 'temporary',
    WARNING = 'warning'
  }
  
  export enum AppealStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    UNDER_REVIEW = 'under_review'
  }
  
  export interface Ban {
    id: string;
    playerName: string;
    playerIdentifiers: PlayerIdentifiers;
    reason: string;
    evidence: Evidence[];
    banType: BanType;
    status: BanStatus;
    duration?: number; // In days, null for permanent
    issuedBy: string; // Reference to User ID
    issuedAt: Date;
    expiresAt?: Date;
    comments: Comment[];
    appealId?: string; // Reference to Appeal ID if appealed
    relatedBans?: string[]; // References to related Ban IDs
    lastUpdatedBy?: string; // Reference to User ID
    lastUpdatedAt?: Date;
  }
  
  export interface PlayerIdentifiers {
    steamId?: string;
    discordId?: string;
    fivemId?: string;
    ipAddress?: string;
    hwid?: string; // Hardware ID
  }
  
  export interface Evidence {
    id: string;
    type: 'image' | 'video' | 'text' | 'log';
    url?: string;
    content?: string;
    description: string;
    uploadedBy: string; // Reference to User ID
    uploadedAt: Date;
  }
  
  export interface Comment {
    id: string;
    content: string;
    createdBy: string; // Reference to User ID
    createdAt: Date;
    isEdited: boolean;
    editedAt?: Date;
  }
  
  export interface Appeal {
    id: string;
    banId: string; // Reference to Ban ID
    playerName: string;
    playerEmail?: string;
    playerDiscord?: string;
    reason: string;
    status: AppealStatus;
    evidence?: Evidence[];
    createdAt: Date;
    reviewedBy?: string; // Reference to User ID
    reviewedAt?: Date;
    reviewNote?: string;
    comments: Comment[];
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }
  
  export interface ApiError {
    statusCode: number;
    message: string;
    details?: string;
  }
  