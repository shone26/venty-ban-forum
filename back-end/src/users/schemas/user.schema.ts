/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  clerkId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: [String], enum: UserRole, default: [UserRole.USER] })
  roles: UserRole[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isBanned: boolean;

  @Prop()
  banReason?: string;

  @Prop()
  lastLoginAt?: Date;

  @Prop({ default: 0 })
  postCount: number;

  @Prop({ default: 0 }) 
  commentCount: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for quick search and filtering
UserSchema.index({ clerkId: 1, email: 1, username: 'text' });
UserSchema.index({ createdAt: 1 });
UserSchema.index({ isDeleted: 1, isBanned: 1 });