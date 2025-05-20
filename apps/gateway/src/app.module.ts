import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true ,
    envFilePath: 'prod.env'}),
  ],
})
export class AppModule {}
