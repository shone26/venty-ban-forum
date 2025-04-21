// src/bans/dto/ban-query.dto.ts
import { IsEnum, IsOptional, IsString, IsNumber, IsIn } from 'class-validator';
import { BanStatus } from '../schemas/ban.schema';
import { Type } from 'class-transformer';

export class BanQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsEnum(BanStatus)
  status?: BanStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  steamId?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}