import { applyDecorators } from '@nestjs/common';
import { IsEmail, MinLength, MaxLength } from 'class-validator';

export const EmailField = () =>
  applyDecorators(IsEmail(), MinLength(5), MaxLength(255));
