import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserPayload } from './interfaces/createUser.interfaces';
import { CustomLogger } from '../../common/logger/custom.logger';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private logger: CustomLogger,
  ) {}

  async createNewUser(createUserPayload: CreateUserPayload): Promise<User> {
    const { email } = createUserPayload;
    try {
      this.logger.info('Creation of new user started', {
        email,
      });
      return await this.userModel.create(createUserPayload);
    } catch (error) {
      this.logger.error('Creation of new user failed', error, {
        email,
      });

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
