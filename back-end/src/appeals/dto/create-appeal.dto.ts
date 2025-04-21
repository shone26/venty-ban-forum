// src/appeals/dto/create-appeal.dto.ts
import { IsEnum, IsOptional, IsString, IsMongoId, IsNotEmpty } from 'class-validator';
import { AppealStatus } from '../schemas/appeal.schema';

export class CreateAppealDto {
  @IsMongoId()
  @IsNotEmpty()
  ban: string;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  evidence: string;
}