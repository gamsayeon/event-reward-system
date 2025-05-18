import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RewardDocument = Reward & Document & { _id: Types.ObjectId };

@Schema()
export class Reward {
  @Prop({ required: true })
  rewardType: string;

  @Prop()
  rewardName?: string;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  description?: string;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
