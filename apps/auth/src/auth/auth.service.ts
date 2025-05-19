import * as common from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/user.schema';

@common.Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;
    const passwordValid: boolean = await bcrypt.compare(
      password,
      user.password,
    );
    if (passwordValid) return user;
    return null;
  }

  async login(user: UserDocument) {
    const { _id: userId } = user;
    const payload = {
      username: user.username,
      sub: userId,
      roles: user.roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
