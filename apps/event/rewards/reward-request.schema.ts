import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardRequestDocument = RewardRequest & Document;

@Schema()
export class RewardRequest {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true, enum: ['SUCCESS', 'FAILED', 'PENDING'] })
  status: string;

  @Prop({ default: Date.now })
  requestedAt: Date;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
