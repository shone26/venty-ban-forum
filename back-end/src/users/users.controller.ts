/* eslint-disable prettier/prettier */
// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UnauthorizedException,
  NotFoundException,
  Headers,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      // Optional: Add admin role for development/testing
      const userToCreate = {
        ...createUserDto,
        roles: createUserDto.roles || [UserRole.USER]
      };

      return await this.usersService.create(userToCreate);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  async getCurrentUser(@Headers('x-clerk-id') clerkId: string) {
    try {
      // Log the incoming request details
      console.log('GET /users/me - Clerk ID from header:', clerkId);
      
      if (!clerkId) {
        console.log('No clerk ID provided in header');
        throw new UnauthorizedException('No user authenticated');
      }
      
      // Try to find user by Clerk ID
      const user = await this.usersService.findByClerkId(clerkId);
      console.log('Found user:', {
        id: user._id,
        clerkId: user.clerkId,
        username: user.username,
        roles: user.roles
      });
      
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw new NotFoundException('User not found');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}