import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const authTarget = configService.get<string>('AUTH_SERVER_URL');
  const eventTarget = configService.get<string>('EVENT_SERVER_URL');
  const port = configService.get<number>('PORT') ?? 3000;

  // '/auth' 경로는 Auth Server(포트 3001)로 프록시
  app.use(
    '/auth', 
    createProxyMiddleware({
      target: authTarget,
      changeOrigin: true,
    }),
  );
  

  // '/events' 경로는 Event Server(포트 3002)로 프록시
  app.use(
    '/events',
    createProxyMiddleware({
      target: eventTarget,
      changeOrigin: true,
    }),
  );

  // '/rewards' 경로는 Event Server(포트 3002)로 프록시
  app.use(
    '/rewards',
    createProxyMiddleware({
      target: eventTarget,
      changeOrigin: true,
    }),
  );

  // '/reward-requests' 경로는 Event Server(포트 3002)로 프록시
  app.use(
    '/reward-requests',
    createProxyMiddleware({
      target: eventTarget,
      changeOrigin: true,
    }),
  );

  await app.listen(port);
}
bootstrap();
