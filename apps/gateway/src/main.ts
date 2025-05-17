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
  

  // '/event' 경로는 Event Server(포트 3002)로 프록시
  app.use(
    '/event',
    createProxyMiddleware({
      target: eventTarget,
      changeOrigin: true,
      pathRewrite: { '^/event': '' },
    }),
  );

  await app.listen(port);
}
bootstrap();
