/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ClerkStrategy } from './clerk.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { ClerkClientProvider } from '../provider/clerk-client.provider';


@Module({
  imports: [PassportModule, ConfigModule],
  providers: [ClerkStrategy, ClerkClientProvider, AuthService],
  exports: [PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}