import { EmailField } from '../../common/validation/email.validation';
import { NameField } from '../../common/validation/name.validation';
import { PasswordField } from '../../common/validation/password.validation';

export class RegisterRequestDto {
  @EmailField()
  email: string;

  @NameField()
  name: string;

  @PasswordField()
  password: string;
}

export class RegisterResponseDto {
  jwt: string;
}
