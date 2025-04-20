// src/auth/clerk.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, 'clerk') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async (request, rawJwtToken, done) => {
        try {
          // Fetch Clerk's JWKS
          const response = await axios.get(
            `${this.configService.get('CLERK_ISSUER')}/.well-known/jwks.json`,
          );
          const keys = response.data.keys;
          
          // Find the signing key that matches the JWT
          // In a real implementation, you'd need to parse the JWT header
          // to find the correct key ID (kid) and then locate that key
          
          // For simplicity, we're returning the first key
          // In production, you would match the key ID
          done(null, keys[0].x5c[0]);
        } catch (error) {
          done(error);
        }
      },
      algorithms: ['RS256'],
      issuer: this.configService.get('CLERK_ISSUER'),
      audience: this.configService.get('CLERK_AUDIENCE'),
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

