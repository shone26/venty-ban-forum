  // src/users/schemas/user.schema.ts
  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import { Document } from 'mongoose';

  export enum UserRole {
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    USER = 'user',
  }

  @Schema({ timestamps: true })
  export class User extends Document {
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
  }

  export const UserSchema = SchemaFactory.createForClass(User);


  // Index for quick search and filtering
  UserSchema.index({ clerkId: 1, email: 1, username: 'text' });