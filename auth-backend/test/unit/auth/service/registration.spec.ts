import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import crypto from 'crypto';
import { AuthService } from '../../../../src/auth/service/auth.service';
import { User } from '../../../../src/user/schemas/user.schema';
import { UserService } from '../../../../src/user/service/user.service';
import { ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockRegistrationPayload = {
    email: 'test@example.com',
    password: 'Password123!',
    name: 'Test User',
  };

  const mockCreatedUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    hashedPassword: 'mocked-hash',
    salt: 'mocked-salt',
  } as User;

  const mockJwtToken = 'mocked.jwt.token';
  const mockedSalt = 'mockedSalt';
  const mockedHash = 'mockedHash';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            createNewUser: jest.fn().mockResolvedValue(mockCreatedUser),
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

    jest.spyOn(crypto, 'randomBytes').mockImplementation(() => {
      return { toString: () => mockedSalt };
    });
    jest.spyOn(crypto, 'pbkdf2Sync').mockImplementation(() => {
      return { toString: () => mockedHash } as any;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      // Execute
      const result = await authService.register(mockRegistrationPayload);

      // Assert
      expect(userService.createNewUser).toHaveBeenCalledWith({
        email: mockRegistrationPayload.email,
        name: mockRegistrationPayload.name,
        hashedPassword: mockedHash,
        salt: mockedSalt,
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockCreatedUser.email,
        sub: mockCreatedUser.id,
      });

      expect(result).toEqual({
        jwt: mockJwtToken,
      });
    });

    it('should throw if UserService fails to create user', async () => {
      // Setup
      jest
        .spyOn(userService, 'createNewUser')
        .mockRejectedValue(new ConflictException('User already exists'));

      // Execute & Assert
      await expect(
        authService.register(mockRegistrationPayload),
      ).rejects.toThrow('User already exists');
    });

    it('should properly hash the password with a salt', async () => {
      // Execute
      await authService.register(mockRegistrationPayload);

      // Assert
      expect(crypto.randomBytes).toHaveBeenCalledWith(32);
      expect(crypto.pbkdf2Sync).toHaveBeenCalledWith(
        mockRegistrationPayload.password,
        expect.any(String),
        10000,
        64,
        'sha512',
      );
    });
  });
});
