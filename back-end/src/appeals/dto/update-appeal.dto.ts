// src/appeals/dto/update-appeal.dto.ts
import { IsEnum, IsOptional, IsString, IsMongoId } from 'class-validator';
import { AppealStatus } from '../schemas/appeal.schema';
import { PartialType } from '@nestjs/mapped-types';
import { CreateAppealDto } from './create-appeal.dto';

export class UpdateAppealDto extends PartialType(CreateAppealDto) {
  @IsEnum(AppealStatus)
  @IsOptional()
  status?: AppealStatus;

  @IsString()
  @IsOptional()
  reviewNotes?: string;

  @IsMongoId()
  @IsOptional()
  reviewedBy?: string;
}