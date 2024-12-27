import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './service/user.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { ProfileDtoMapper } from './mappers/profileDto.mapper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, ProfileDtoMapper],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
