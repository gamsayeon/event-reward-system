import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const authTarget = configService.get<string>('AUTH_SERVER_URL');
  const eventTarget = configService.get<string>('EVENT_SERVER_URL');
  const port = configService.get<number>('PORT') ?? 3000;
  const jwtSecret = configService.get<string>('AUTH_JWT_SECRET') ?? 'default_secret_key';

  // JWT 검증 미들웨어
  app.use(async (req, res, next) => {
    try {
      // '/auth' 경로는 별도 서버니까 JWT 검증 제외
      if (req.path.startsWith('/auth')) {
        return next();
      }

      const authHeader = req.headers['authorization'];
      if (!authHeader) throw new UnauthorizedException('Authorization header missing');

      const token = authHeader.split(' ')[1];
      if (!token) throw new UnauthorizedException('Token missing');

      const payload = jwt.verify(token, jwtSecret) as any;
      // payload에 user 정보(id, role 등)가 있어야 합니다.
      (req as any).user = payload;

      next();
    } catch (err) {
      res.status(401).json({ message: (err as Error).message || 'Unauthorized' });
    }
  });

  // Role 체크 미들웨어 (JWT 미들웨어 다음에 위치)
  app.use('/events', (req, res, next) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const roles = Array.isArray(user.roles) ? user.roles.map(r => r.toUpperCase()) : [];

    // API 경로별 허용 권한 설정
    const accessRules: Record<string, string[]> = {
      '/reward-requests': ['ADMIN', 'AUDITOR', 'OPERATOR', 'USER'],
      '/request-reward': ['USER', 'ADMIN'],
      '/rewards': ['OPERATOR', 'ADMIN'],
      '/': ['ADMIN', 'OPERATOR', 'AUDITOR', 'USER'], // 기본 조회 권한
    };

    function hasAccess(path: string) {
      for (const pattern in accessRules) {
        if (path.startsWith(pattern)) {
          const allowedRoles = accessRules[pattern].map(r => r.toUpperCase());
          return roles.some(role => allowedRoles.includes(role));
        }
      }
      return roles.includes('ADMIN');
    }

    if (!hasAccess(req.path)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }

    next();
  });

  // /auth 프록시 설정 (JWT 검증 제외)
  app.use(
    '/auth',
    createProxyMiddleware({
      target: authTarget,
      changeOrigin: true,
    }),
  );

  app.use('/events', (req, res, next) => {
    const user = (req as any).user;
    if (user) {
      req.headers['X-User-Id'] = user.sub;
      req.headers['X-User-Role'] = Array.isArray(user.roles)
        ? user.roles.map(r => r.toUpperCase()).join(',')
        : user.roles?.toUpperCase() || '';
    }
    next();
  });

  app.use('/events', createProxyMiddleware({
    target: eventTarget,
    changeOrigin: true,
    },
  ));

  await app.listen(port);
}

bootstrap();
