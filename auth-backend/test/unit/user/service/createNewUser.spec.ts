import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';
import { User } from '../../../../src/user/schemas/user.schema';
import { UserService } from '../../../../src/user/service/user.service';
import { CustomLogger } from '../../../../src/common/logger/custom.logger';
import { MockedLogger } from '../../../utils/mockedLogger';

describe('UserService', () => {
  let userService: UserService;
  let userModel: Model<User>;

  const mockCreateUserPayload = {
    email: 'test@example.com',
    name: 'Test User',
    hashedPassword: 'hashedPassword123',
    salt: 'salt123',
  };

  const mockCreatedUser = {
    id: 'user-123',
    ...mockCreateUserPayload,
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: CustomLogger, useClass: MockedLogger },
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewUser', () => {
    it('should successfully create a new user', async () => {
      // Setup
      jest.spyOn(userModel, 'create').mockResolvedValue(mockCreatedUser as any);

      // Execute
      const result = await userService.createNewUser(mockCreateUserPayload);

      // Assert
      expect(userModel.create).toHaveBeenCalledWith(mockCreateUserPayload);
      expect(result).toEqual(mockCreatedUser);
    });

    it('should throw ConflictException when user with email already exists', async () => {
      // Setup
      const duplicateKeyError = new Error('Duplicate key error');
      (duplicateKeyError as any).code = 11000;
      jest.spyOn(userModel, 'create').mockRejectedValue(duplicateKeyError);

      // Execute & Assert
      await expect(
        userService.createNewUser(mockCreateUserPayload),
      ).rejects.toThrow(new ConflictException('User already exists'));
    });

    it('should propagate unknown errors', async () => {
      // Setup
      const unknownError = new Error('Unknown database error');
      jest.spyOn(userModel, 'create').mockRejectedValue(unknownError);

      // Execute & Assert
      await expect(
        userService.createNewUser(mockCreateUserPayload),
      ).rejects.toThrow('Unknown database error');
    });
  });
});
