// src/types/api.types.ts

import { AppealStatus, BanStatus, BanType, Evidence, PlayerIdentifiers, User } from "./common.types";

export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
  }
  
  export interface BanRequest {
    playerName: string;
    playerIdentifiers: Partial<PlayerIdentifiers>;
    reason: string;
    banType: BanType;
    duration?: number; // Required if banType is TEMPORARY
    evidence?: Partial<Evidence>[];
    comment?: string; // Initial comment
  }
  
  export interface BanQueryParams {
    page?: number;
    limit?: number;
    status?: BanStatus;
    banType?: BanType;
    playerName?: string;
    steamId?: string;
    discordId?: string;
    fivemId?: string;
    ipAddress?: string;
    issuedBy?: string;
    startDate?: Date;
    endDate?: Date;
    sortBy?: 'issuedAt' | 'expiresAt' | 'playerName';
    sortOrder?: 'asc' | 'desc';
  }
  
  export interface AppealRequest {
    banId: string;
    playerName: string;
    playerEmail?: string;
    playerDiscord?: string;
    reason: string;
    evidence?: Partial<Evidence>[];
  }
  
  export interface ReviewAppealRequest {
    status: AppealStatus;
    reviewNote?: string;
  }
  
  export interface StatisticsResponse {
    activeBans: number;
    expiredBans: number;
    appealedBans: number;
    revokedBans: number;
    pendingAppeals: number;
    totalUsers: number;
    bansByMonth: {
      month: string;
      count: number;
    }[];
    bansByType: {
      type: BanType;
      count: number;
    }[];
    mostActiveModerators: {
      userId: string;
      username: string;
      banCount: number;
    }[];
  }