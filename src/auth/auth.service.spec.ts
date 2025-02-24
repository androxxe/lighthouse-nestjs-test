import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CryptoService } from './crypto/crypto.service';
import { JwtModule } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, JwtModule],
      controllers: [AuthController],
      providers: [
        CryptoService,
        {
          provide: AuthService,
          useValue: { register: jest.fn(), login: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call AuthService.register and return response', async () => {
    const mockRegister = {
      email: 'john@example.com',
      name: 'John Doe',
      id: '123',
    };

    jest.spyOn(authService, 'register').mockResolvedValue(mockRegister);

    const result = await controller.register({ name: 'John Doe', email: 'john@example.com', password: '123456' });

    expect(authService.register).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });
    expect(result).toEqual({
      message: expect.any(String),
      data: { email: 'john@example.com' },
    });
  });

  it('should call AuthService.login and return response', async () => {
    const mockLogin = {
      user: {
        email: 'john@example.com',
        name: 'John Doe',
        id: '12312125125',
      },
      access_token: 'access_token',
      refresh_token: 'refresh_token',
    };

    jest.spyOn(authService, 'login').mockResolvedValue(mockLogin);

    const result = await controller.login({
      email: 'john@example.com',
      password: '123456',
    });

    expect(authService.login).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: '123456',
    });

    expect(result).toEqual({
      message: expect.any(String),
      data: {
        user: {
          id: expect.any(String),
          email: 'john@example.com',
          name: expect.any(String),
        },
        access_token: expect.any(String),
        refresh_token: expect.any(String),
      },
    });
  });
});
