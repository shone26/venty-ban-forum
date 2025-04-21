/* eslint-disable prettier/prettier */
// src/auth/clerk.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, 'clerk') {
  constructor(private readonly configService: ConfigService) {
    // Get config values first
    const clerkIssuer = configService.get<string>('CLERK_ISSUER');
    const clerkAudience = configService.get<string>('CLERK_AUDIENCE');
    
    // Then pass them to super()
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async (request, rawJwtToken, done) => {
        try {
          // Use the local variable instead of this.configService
          const response = await axios.get(
            `${clerkIssuer}/.well-known/jwks.json`,
          );
          const keys = response.data.keys;
          
          // For simplicity, returning the first key
          // In production, you would match the key ID
          done(null, keys[0].x5c[0]);
        } catch (error) {
          done(error);
        }
      },
      algorithms: ['RS256'],
      issuer: clerkIssuer,
      audience: clerkAudience,
    });
  }

  async validate(payload: any) {
    // The JWT payload has been verified by Passport
    // Extract user info from the payload
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.metadata?.roles || ['user'],
    };
  }
}