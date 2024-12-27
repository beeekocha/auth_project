import { Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { GetProfileResponseDto } from '../dto/profile.dto';

@Injectable()
export class ProfileDtoMapper {
  toGetProfileResponse(user: User): GetProfileResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
