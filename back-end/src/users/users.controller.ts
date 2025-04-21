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
    // Optional: Implement additional validation or role assignment logic
    try {
      // Default to user role, potentially add admin logic later
      const userToCreate = {
        ...createUserDto,
        roles: [UserRole.USER]
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

  @Get('me')
  async getCurrentUser(@Request() req) {
    try {
      // In a real-world scenario, you would validate the Clerk token here
      // For now, retrieve user by Clerk ID from headers
      const clerkId = req.headers['x-clerk-id']; 

      if (!clerkId) {
        throw new UnauthorizedException('No user authenticated');
      }

      try {
        // Try to find user by Clerk ID
        return await this.usersService.findByClerkId(clerkId);
      } catch (notFoundError) {
        // If user not found, you might want to handle this differently
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }
}// Get current authenticated user 
// @Get('me')
// async getCurrentUser(@Request() req) {
//   try {
//     // In a real-world scenario, you would validate the Clerk token here
//     // For now, this is a placeholder implementation
//     const clerkId = req.headers['x-clerk-id']; // You'll need to pass this from the frontend

//     if (!clerkId) {
//       throw new UnauthorizedException('No user authenticated');
//     }

//     const user = await this.usersService.findByClerkId(clerkId);
//     return user;
//   } catch (error) {
//     // If user not found, you might want to handle this differently
//     throw new NotFoundException('User not found');
//   }
