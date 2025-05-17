import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { IUser } from '../common/interfaces/user.interface';
import { User } from '../users/user.schema';
import { BadRequestException } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: IUser) {
    if (!body.password) {
      throw new BadRequestException('Password is required');
    }
    const user = await this.authService['usersService'].createUser(
      body.username,
      body.password,
    );
    return { username: user.username, roles: user.roles };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }
}
