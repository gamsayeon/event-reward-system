import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(
    username: string,
    password: string,
    roles: string[] = ['USER'],
  ): Promise<User> {
    const hashed = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      username,
      password: hashed,
      roles,
    });
    return createdUser.save();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }
}
