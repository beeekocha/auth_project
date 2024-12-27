import { Injectable } from '@nestjs/common';
import { LoginRequestDto, LoginResponseDto } from '../dto/login.dto';
import {
  LoginPayload,
  LoginResult,
} from '../service/interfaces/login.interfaces';

@Injectable()
export class LoginDtoMapper {
  toLoginPayload(request: LoginRequestDto): LoginPayload {
    return {
      email: request.email,
      password: request.password,
    };
  }

  toLoginResponseDto(loginResult: LoginResult): LoginResponseDto {
    return {
      jwt: loginResult.jwt,
    };
  }
}
