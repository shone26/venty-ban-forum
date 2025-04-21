// src/bans/dto/create-ban.dto.ts
import { IsEnum, IsOptional, IsString, IsNumber, IsNotEmpty, ValidateIf } from 'class-validator';
import { BanDuration } from '../schemas/ban.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBanDto {
  @ApiProperty({ description: 'Name of the player being banned' })
  @IsString()
  @IsNotEmpty()
  playerName: string;

  @ApiProperty({ description: 'Steam ID of the player' })
  @IsString()
  @IsNotEmpty()
  steamId: string;

  @ApiPropertyOptional({ description: 'Discord ID of the player' })
  @IsString()
  @IsOptional()
  discordId?: string;

  @ApiPropertyOptional({ description: 'IP address of the player' })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiProperty({ description: 'Reason for the ban' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ description: 'Evidence supporting the ban' })
  @IsString()
  @IsNotEmpty()
  evidence: string;

  @ApiProperty({ 
    description: 'Type of ban duration',
    enum: BanDuration,
    enumName: 'BanDuration'
  })
  @IsEnum(BanDuration)
  @IsNotEmpty()
  durationType: BanDuration;

  @ApiPropertyOptional({ 
    description: 'Number of days the ban will last (required for temporary bans)' 
  })
  @IsNumber()
  @ValidateIf(o => o.durationType === BanDuration.TEMPORARY)
  durationDays?: number;

  @ApiPropertyOptional({ description: 'Additional notes for the ban' })
  @IsString()
  @IsOptional()
  notes?: string;
}