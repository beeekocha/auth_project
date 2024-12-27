import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserPayload } from './interfaces/createUser.interfaces';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createNewUser(createUserPayload: CreateUserPayload): Promise<User> {
    try {
      return await this.userModel.create(createUserPayload);
    } catch (error) {
      if (error.code === 11000)
        throw new ConflictException('User already exists');
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const existingUser = await this.userModel.findOne({ email }).exec();
    return existingUser;
  }

  async getUserDataByUserId(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }
}
