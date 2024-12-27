import { Injectable } from '@nestjs/common';
import {
  RegisterRequestDto,
  RegisterResponseDto,
} from '../dto/registration.dto';
import {
  RegistrationPayload,
  RegistrationResult,
} from '../service/interfaces/register.interfaces';

@Injectable()
export class RegistrationDtoMapper {
  toRegistrationPayload(request: RegisterRequestDto): RegistrationPayload {
    return {
      email: request.email,
      name: request.name,
      password: request.password,
    };
  }

  toRegistrationResponseDto(
    registrationResult: RegistrationResult,
  ): RegisterResponseDto {
    return {
      jwt: registrationResult.jwt,
    };
  }
}
