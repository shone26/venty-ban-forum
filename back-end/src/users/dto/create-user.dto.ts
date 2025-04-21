// src/users/dto/create-user.dto.ts
import { IsEnum, IsOptional, IsString, IsEmail, IsArray } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @IsString()
  clerkId: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsArray()
  @IsEnum(UserRole, { each: true })
  @IsOptional()
  roles?: UserRole[];
}