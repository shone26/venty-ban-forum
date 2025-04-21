// src/bans/dto/update-ban.dto.ts
import { IsEnum, IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { BanDuration, BanStatus } from '../schemas/ban.schema';
import { PartialType } from '@nestjs/mapped-types';
import { CreateBanDto } from './create-ban.dto';

export class UpdateBanDto extends PartialType(CreateBanDto) {
  @IsEnum(BanStatus)
  @IsOptional()
  status?: BanStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDate()
  @IsOptional()
  expiresAt?: Date;
}