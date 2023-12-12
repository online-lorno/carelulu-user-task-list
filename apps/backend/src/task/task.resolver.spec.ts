import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { TaskResolver } from './task.resolver';

describe('TaskResolver', () => {
  let resolver: TaskResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskResolver,
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
        // Add other providers as needed
      ],
    }).compile();

    resolver = module.get<TaskResolver>(TaskResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
