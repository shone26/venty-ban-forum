/* eslint-disable prettier/prettier */
// src/auth/auth.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Get('users')
  getHello(): Promise<any> {
    return this.authService.getAllUsers();
  }
}