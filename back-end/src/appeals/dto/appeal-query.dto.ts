// src/appeals/dto/appeal-query.dto.ts
import { IsEnum, IsOptional, IsString, IsNumber, IsIn } from 'class-validator';
import { AppealStatus } from '../schemas/appeal.schema';
import { Type } from 'class-transformer';

export class AppealQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsEnum(AppealStatus)
  status?: AppealStatus;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}