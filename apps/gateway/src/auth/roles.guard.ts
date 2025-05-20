import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly allowedRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) throw new ForbiddenException('User info missing');

    if (!this.allowedRoles.includes(user.role.toUpperCase())) {
      throw new ForbiddenException('Access denied: insufficient role');
    }

    return true;
  }
}
