import { applyDecorators } from '@nestjs/common';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export const PasswordField = () =>
  applyDecorators(
    IsString(),
    MinLength(8),
    MaxLength(128),
    Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
      message:
        'Password must contain at least 1 letter, 1 number, and 1 special character',
    }),
  );
