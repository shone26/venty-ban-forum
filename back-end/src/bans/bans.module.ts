// src/bans/bans.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BansController } from './bans.controller';
import { BansService } from './bans.service';
import { Ban, BanSchema } from './schemas/ban.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ban.name, schema: BanSchema },
    ]),
  ],
  controllers: [BansController],
  providers: [BansService],
  exports: [BansService],
})
export class BansModule {}