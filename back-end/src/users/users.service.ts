/* eslint-disable prettier/prettier */

// src/users/users.service.ts
import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if a user with this Clerk ID or email already exists
    const existingUser = await this.userModel.findOne({
      $or: [
        { clerkId: createUserDto.clerkId },
        { email: createUserDto.email }
      ]
    }).exec();

    if (existingUser) {
      // If user exists, update the existing user
      // Convert _id to string to ensure type safety
      const userId = existingUser._id.toString();
      return this.updateExistingUser(userId, createUserDto);
    }

    // Create a new user
    const createdUser = new this.userModel({
      ...createUserDto,
      // Default to user role if not specified
      roles: createUserDto.roles && createUserDto.roles.length > 0 
        ? createUserDto.roles 
        : [UserRole.USER]
    });
    console.log('Creating user:', createdUser);
    return createdUser.save();
  }

  async updateExistingUser(id: string, updateData: CreateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id, 
      { 
        ...updateData,
        // Preserve existing roles if not overridden
        roles: updateData.roles && updateData.roles.length > 0 
          ? updateData.roles 
          : undefined 
      }, 
      { new: true }
    ).exec();
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    // Ensure valid ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid user ID: ${id}`);
    }

    const user = await this.userModel.findById(id).exec();
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async findByClerkId(clerkId: string): Promise<User> {
    const user = await this.userModel.findOne({ clerkId }).exec();
    
    if (!user) {
      throw new NotFoundException(`User with Clerk ID ${clerkId} not found`);
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Ensure valid ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid user ID: ${id}`);
    }

    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    // Ensure valid ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid user ID: ${id}`);
    }

    const result = await this.userModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return { deleted: true };
  }
}