import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  eventName: string;

  @Prop({ required: true })
  condition: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  status: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Reward' }], default: [] })
  rewards: Types.ObjectId[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
