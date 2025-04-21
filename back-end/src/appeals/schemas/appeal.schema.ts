// src/appeals/schemas/appeal.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum AppealStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class Appeal extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Ban', required: true })
  ban: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  evidence: string;

  @Prop({ required: true, enum: AppealStatus, default: AppealStatus.PENDING })
  status: AppealStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  appealedBy: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  reviewedBy?: string;

  @Prop()
  reviewNotes?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AppealSchema = SchemaFactory.createForClass(Appeal);

// Index for quick search and filtering
AppealSchema.index({ status: 1, ban: 1, appealedBy: 1 });