/* eslint-disable prettier/prettier */
// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async getAllUsers() {
    return [
      {
        id: 'mock-user-id',
        username: 'Mock User',
        email: 'mock@example.com',
        roles: ['admin', 'moderator', 'user'],
      }
    ];
  }
}