import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './events.dto';
import { Event } from './events.schema';

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

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Event> {
    const event = await this.eventsService.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }
}
