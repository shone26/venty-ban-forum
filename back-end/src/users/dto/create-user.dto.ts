/* eslint-disable prettier/prettier */
// src/users/dto/create-user.dto.ts
import { IsEnum, IsOptional, IsString, IsEmail, IsArray, IsNotEmpty } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  clerkId: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsArray()
  @IsEnum(UserRole, { each: true })
  @IsOptional()
  roles?: UserRole[];
}