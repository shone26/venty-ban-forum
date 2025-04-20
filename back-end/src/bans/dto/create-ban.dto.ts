// src/bans/dto/create-ban.dto.ts
import { IsEnum, IsOptional, IsString, IsNumber, IsNotEmpty, ValidateIf } from 'class-validator';
import { BanDuration } from '../schemas/ban.schema';

export class CreateBanDto {
  @IsString()
  @IsNotEmpty()
  playerName: string;

  @IsString()
  @IsNotEmpty()
  steamId: string;

  @IsString()
  @IsOptional()
  discordId?: string;

  @IsString()
  @IsOptional()
  ipAddress?: string;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  evidence: string;

  @IsEnum(BanDuration)
  @IsNotEmpty()
  durationType: BanDuration;

  @IsNumber()
  @ValidateIf(o => o.durationType === BanDuration.TEMPORARY)
  durationDays?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}