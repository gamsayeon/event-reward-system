import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../users/create-user.dto';
import { UserDocument } from '../users/user.schema';
import { BadRequestException } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserdto: CreateUserDto) {
    if (!createUserdto.password) {
      throw new BadRequestException('Password is required');
    }
    const user =
      await this.authService['usersService'].createUser(createUserdto);
    return { username: user.username, roles: user.roles };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: UserDocument }) {
    return this.authService.login(req.user);
  }
}
