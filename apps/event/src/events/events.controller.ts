import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Headers,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './events.dto';
import { UpdateEventDto } from './update-events.dto';
import { CreateRewardDto } from '../rewards/reward.dto';
import { UpdateRewardDto } from '../rewards/update-reward.dto';
import { Event } from './events.schema';
import { Reward } from '../rewards/reward.schema';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Get('/reward-requests')
  async getRewardRequests(
    @Headers('X-User-Id') userId: string,
    @Headers('X-User-Role') role: string | string[],
    @Query('eventId') eventId?: string,
    @Query('status') status?: string,
  ): Promise<any[]> {
    if (!role) {
      throw new BadRequestException('권한 정보가 부족합니다.');
    }

    const roles = Array.isArray(role)
      ? role.map((r) => r.toUpperCase())
      : [role.toUpperCase()];
    if (roles.some((r) => ['ADMIN', 'AUDITOR', 'OPERATOR'].includes(r))) {
      return this.eventsService.findAllRewardRequests({ eventId, status });
    }

    return this.eventsService.findUserRewardRequests(userId, {
      eventId,
      status,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Event> {
    const event = await this.eventsService.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  @Post(':id/rewards')
  async addReward(
    @Param('id') eventId: string,
    @Body() rewardDto: CreateRewardDto,
  ) {
    return this.eventsService.addReward(eventId, rewardDto);
  }

  @Patch(':eventId')
  async updateEvent(
    @Param('eventId') eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventsService.updateEvent(eventId, updateEventDto);
  }

  @Patch('/rewards/:rewardId')
  async updateReward(
    @Param('rewardId') rewardId: string,
    @Body() updateRewardDto: UpdateRewardDto,
  ): Promise<Reward> {
    return this.eventsService.updateReward(rewardId, updateRewardDto);
  }

  @Post(':eventId/request-reward')
  async requestReward(
    @Param('eventId') eventId: string,
    @Headers('X-User-Id') userId: string,
  ): Promise<any> {
    return this.eventsService.requestReward(userId, eventId);
  }
}
