// src/app.module.ts
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    MongooseModule.forRoot(String(process.env.EVENT_DB_URL)),
    EventsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
