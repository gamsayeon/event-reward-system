import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.EVENT_SERVER_PORT) || 3000;
  await app.listen(port);
}
void bootstrap();
