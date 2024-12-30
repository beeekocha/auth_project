import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/service/user.service';
import crypto from 'crypto';
import { User } from '../../user/schemas/user.schema';
import { LoginPayload, LoginResult } from './interfaces/login.interfaces';
import {
  RegistrationPayload,
  RegistrationResult,
} from './interfaces/register.interfaces';
import { CustomLogger } from '../../common/logger/custom.logger';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private logger: CustomLogger,
  ) {}

  async register(
    registrationPayload: RegistrationPayload,
  ): Promise<RegistrationResult> {
    const { email, name, password } = registrationPayload;

    try {
      this.logger.info('Registration started', {
        email,
      });
      const { salt, hash } = this.genPassword(password);
      const user = await this.userService.createNewUser({
        email,
        name,
        hashedPassword: hash,
        salt,
      });
      const res = this.signJwt({ id: user.id, email: user.email });
      return res;
    } catch (error) {
      this.logger.error('Registration failed', error, {
        email,
      });
      throw error;
    }
  }

  async login(loginPayload: LoginPayload): Promise<LoginResult> {
    const { email, password } = loginPayload;
    try {
      this.logger.info('Login started', {
        email,
      });

      const user = await this.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const res = this.signJwt({ id: user.id, email: user.email });

      return res;
    } catch (error) {
      this.logger.error('Login failed', error, {
        email,
      });
      throw error;
    }
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email);
    if (user && this.validPassword(pass, user.hashedPassword, user.salt)) {
      return user;
    }
    return null;
  }

  private signJwt(payload: { id: string; email: string }) {
    return {
      jwt: this.jwtService.sign({ email: payload.email, sub: payload.id }),
    };
  }

  private genPassword(password: string) {
    const salt = crypto.randomBytes(32).toString('hex');
    const genHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');

    return {
      salt: salt,
      hash: genHash,
    };
  }

  private validPassword(password: string, hash: string, salt: string) {
    const hashVerify = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');
    return hash === hashVerify;
  }
}
