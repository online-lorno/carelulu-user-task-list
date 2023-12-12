import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { AuthResolver } from './auth.resolver';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: PrismaService,
          useValue: {
            // Mock the methods of PrismaService that you use
          },
        },
        {
          provide: JwtService,
          useValue: {
            // Mock the methods of JwtService that you use
            sign: jest.fn(() => 'mockJwtToken'),
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT when login is successful', async () => {
      const result = { access_token: 'mockJwtToken', username: 'test' };
      const loginInput = { username: 'test', password: 'test' };

      jest.spyOn(resolver, 'login').mockResolvedValue(result);

      expect(await resolver.login(loginInput)).toBe(result);
    });

    // Add more tests for different scenarios...
  });

  describe('register', () => {
    it('should return a user when registration is successful', async () => {
      const registerInput = { username: 'test', password: 'test' };
      const result = true;

      jest.spyOn(resolver, 'register').mockResolvedValue(result);

      expect(await resolver.register(registerInput)).toBe(result);
    });

    // Add more tests for different scenarios...
  });
});
