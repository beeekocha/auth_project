import { applyDecorators } from '@nestjs/common';
import { IsString, MinLength, MaxLength } from 'class-validator';

export const NameField = () =>
  applyDecorators(IsString(), MinLength(2), MaxLength(50));
