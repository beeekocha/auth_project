import { EmailField } from '../../common/validation/email.validation';
import { PasswordField } from '../../common/validation/password.validation';

export class LoginResponseDto {
  jwt: string;
}

export class LoginRequestDto {
  @EmailField()
  email: string;

  @PasswordField()
  password: string;
}
