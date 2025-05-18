import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const port = Number(process.env.AUTH_SERVER_PORT);
  await app.listen(port);
}
void bootstrap();
