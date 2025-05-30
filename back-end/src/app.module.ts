/* eslint-disable prettier/prettier */
// src/app.module.ts - Updated Version
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BansModule } from './bans/bans.module';
import { AppealsModule } from './appeals/appeals.module';
import { UsersModule } from './users/users.module';
import { ClerkAuthGuard } from './auth/clerk-auth.guard';

@Module({
  imports: [
    // Configuration - Make sure this loads first with proper options
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Database - Using forRootAsync with proper error handling
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        
        if (!uri) {
          throw new Error('MONGODB_URI is not defined in environment variables');
        }
        
        return {
          uri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
    }),
    
    // Feature modules
    AuthModule,
    BansModule,
    AppealsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: 'APP_GUARD',
      useClass: ClerkAuthGuard,
    },
  ],
})
export class AppModule {}