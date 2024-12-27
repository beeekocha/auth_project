import {
  Controller,
  UseGuards,
  Request,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './service/user.service';
import { ProfileDtoMapper } from './mappers/profileDto.mapper';
import { GetProfileResponseDto } from './dto/profile.dto';
import {
  JwtAuthGuard,
  JwtAuthenticatedRequest,
} from '../common/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private profileMapper: ProfileDtoMapper,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(
    @Request() req: JwtAuthenticatedRequest,
  ): Promise<GetProfileResponseDto> {
    const result = await this.userService.getUserDataByUserId(req.user.id);
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return this.profileMapper.toGetProfileResponse(result);
  }
}
