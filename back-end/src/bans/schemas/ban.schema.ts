/* eslint-disable prettier/prettier */
// src/bans/schemas/ban.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum BanStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  APPEALED = 'appealed',
  REVOKED = 'revoked',
}

export enum BanDuration {
  TEMPORARY = 'temporary',
  PERMANENT = 'permanent',
}

@Schema({ timestamps: true })
export class Ban extends Document {
  @Prop({ required: true })
  playerName: string;

  @Prop({ required: true })
  steamId: string;

  @Prop()
  discordId?: string;

  @Prop()
  ipAddress?: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  evidence: string;

  // In the Ban schema
  @Prop({ type: [String], default: [] })
  evidencePaths: string[];

  @Prop({ required: true, enum: BanDuration, default: BanDuration.TEMPORARY })
  durationType: BanDuration;

  @Prop({ type: Date })
  expiresAt?: Date;

  @Prop({ required: true, enum: BanStatus, default: BanStatus.ACTIVE })
  status: BanStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  bannedBy: string;

  @Prop()
  notes?: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Appeal' }] })
  appeals: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BanSchema = SchemaFactory.createForClass(Ban);

// Index for quick search and filtering
BanSchema.index({ playerName: 'text', steamId: 1, status: 1 });