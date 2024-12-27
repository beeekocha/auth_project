import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import {
  RegisterRequestDto,
  RegisterResponseDto,
} from './dto/registration.dto';
import { RegistrationDtoMapper } from './mappers/registrationDto.mapper';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { LoginDtoMapper } from './mappers/loginDto.mapper';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private registrationDtoMapper: RegistrationDtoMapper,
    private loginDtoMapper: LoginDtoMapper,
  ) {}

  @Post('register')
  async register(
    @Body() registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const registrationPayload =
      this.registrationDtoMapper.toRegistrationPayload(registerRequestDto);

    const result = await this.authService.register(registrationPayload);

    return this.registrationDtoMapper.toRegistrationResponseDto(result);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    const loginPayload = this.loginDtoMapper.toLoginPayload(loginRequestDto);
    const res = await this.authService.login(loginPayload);
    return this.loginDtoMapper.toLoginResponseDto(res);
  }
}
