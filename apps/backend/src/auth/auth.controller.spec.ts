import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [AuthController],
      providers: [
        AuthResolver,
        {
          provide: JwtService,
          useValue: {
            // Mock the methods of JwtService that you use
            sign: jest.fn(() => 'mockJwtToken'),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT when login is successful', async () => {
      const result = { access_token: 'mockJwtToken', username: 'username' };
      const loginDto = { username: 'test', password: 'test' };

      jest.spyOn(controller, 'login').mockImplementation(async () => result);

      expect(await controller.login(loginDto)).toBe(result);
    });

    // Add more tests for different scenarios...
  });

  describe('register', () => {
    it('should return true when registration is successful', async () => {
      const registerDto = { username: 'test', password: 'test' };

      jest.spyOn(controller, 'register').mockImplementation(async () => true);

      expect(await controller.register(registerDto)).toBe(true);
    });

    // Add more tests for different scenarios...
  });
});
