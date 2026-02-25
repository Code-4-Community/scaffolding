import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { User } from '../users/user.entity';
import { Status } from '../users/types';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const mockAuthService = {
      signup: jest.fn(),
    };

    const mockUsersService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user without publishing name', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      const expectedUser: User = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        status: Status.STANDARD,
        omchaiAssignments: [],
      };

      jest.spyOn(authService, 'signup').mockResolvedValue(true);
      jest.spyOn(usersService, 'create').mockResolvedValue(expectedUser);

      const result = await controller.createUser(signUpDto);

      expect(authService.signup).toHaveBeenCalledWith(signUpDto);
      expect(usersService.create).toHaveBeenCalledWith(
        'test@example.com',
        'John',
        'Doe',
        Status.STANDARD,
        undefined,
      );
      expect(result).toEqual(expectedUser);
    });

    it('should create a user with publishing name', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        publishingName: 'J.D. Writer',
      };

      const expectedUser: User = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        status: Status.STANDARD,
        publishingName: 'J.D. Writer',
        omchaiAssignments: [],
      };

      jest.spyOn(authService, 'signup').mockResolvedValue(true);
      jest.spyOn(usersService, 'create').mockResolvedValue(expectedUser);

      const result = await controller.createUser(signUpDto);

      expect(authService.signup).toHaveBeenCalledWith(signUpDto);
      expect(usersService.create).toHaveBeenCalledWith(
        'test@example.com',
        'John',
        'Doe',
        Status.STANDARD,
        'J.D. Writer',
      );
      expect(result).toEqual(expectedUser);
    });
  });
});
