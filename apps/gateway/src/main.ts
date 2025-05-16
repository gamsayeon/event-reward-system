import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // '/auth' 경로는 Auth Server(포트 3001)로 프록시
  app.use(
    '/auth',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: { '^/auth': '' },
    }),
  );

  // '/event' 경로는 Event Server(포트 3002)로 프록시
  app.use(
    '/event',
    createProxyMiddleware({
      target: 'http://localhost:3002',
      changeOrigin: true,
      pathRewrite: { '^/event': '' },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
