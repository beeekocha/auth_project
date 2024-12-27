import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import crypto from 'crypto';
import { AuthService } from '../../../../src/auth/service/auth.service';
import { User } from '../../../../src/user/schemas/user.schema';
import { UserService } from '../../../../src/user/service/user.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockedHash = 'mockedHash';

  const mockLoginPayload = {
    email: 'test@example.com',
    password: 'Password123!',
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    hashedPassword: mockedHash,
    salt: 'mocked-salt',
  } as User;

  const mockJwtToken = 'mocked.jwt.token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(mockJwtToken),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);

    jest.spyOn(crypto, 'pbkdf2Sync').mockImplementation(() => {
      return { toString: () => mockedHash } as any;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login a user with valid credentials', async () => {
      // Execute
      const result = await authService.login(mockLoginPayload);

      // Assert
      expect(userService.findOneByEmail).toHaveBeenCalledWith(
        mockLoginPayload.email,
      );

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });

      expect(result).toEqual({
        jwt: mockJwtToken,
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Setup
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);

      // Execute & Assert
      await expect(authService.login(mockLoginPayload)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Setup
      jest.spyOn(crypto, 'pbkdf2Sync').mockImplementation(() => {
        return { toString: () => 'different-hash' } as any;
      });

      // Execute & Assert
      await expect(authService.login(mockLoginPayload)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });

    it('should verify password with correct parameters', async () => {
      // Execute
      await authService.login(mockLoginPayload);

      // Assert
      expect(crypto.pbkdf2Sync).toHaveBeenCalledWith(
        mockLoginPayload.password,
        mockUser.salt,
        10000,
        64,
        'sha512',
      );
    });

    it('should not call JWT sign if validation fails', async () => {
      // Setup
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);

      // Execute & Assert
      await expect(authService.login(mockLoginPayload)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );

      //Assert
      expect(jwtService.sign).toHaveBeenCalledTimes(0);
    });
  });
});
