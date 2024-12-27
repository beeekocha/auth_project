import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserJwtInfo } from '../../auth/strategy/jwt.strategy';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

export interface JwtAuthenticatedRequest extends Request {
  user: UserJwtInfo;
}
