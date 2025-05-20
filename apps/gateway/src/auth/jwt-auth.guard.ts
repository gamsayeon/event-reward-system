import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Authorization header missing');

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Token missing');

    try {
      const secret = this.configService.get<string>('AUTH_JWT_SECRET');
      const payload = jwt.verify(token, secret);
      req.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token: ' + err.message);
    }
  }
}
