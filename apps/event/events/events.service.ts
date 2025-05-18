import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './events.schema';
import { Reward, RewardDocument } from '../rewards/reward.schema';
import { Model } from 'mongoose';
import { CreateEventDto } from './events.dto';
import { CreateRewardDto } from '../rewards/reward.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  async findById(id: string): Promise<Event | null> {
    return this.eventModel.findById(id).populate('rewards').exec();
  }

  async addReward(eventId: string, rewardDto: CreateRewardDto): Promise<Event> {
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const reward = new this.rewardModel({ ...rewardDto, event: event._id });
    await reward.save();

    event.rewards = [...event.rewards, reward._id];

    return event.save();
  }
}
