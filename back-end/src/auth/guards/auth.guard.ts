/* eslint-disable prettier/prettier */
// src/auth/guards/auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard {
  canActivate(context: ExecutionContext) {
    return true; // Always allow access
  }

  handleRequest<T = any>(err: any, user: T, info: any): T {
    // Return a mock user
    return {
      userId: 'mock-user-id',
      username: 'Mock User',
      roles: ['admin', 'moderator', 'user'],
    } as unknown as T;
  }
}