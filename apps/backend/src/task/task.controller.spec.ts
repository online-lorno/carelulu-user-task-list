import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { TaskController } from './task.controller';

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: JwtService,
          useValue: {
            // Mock the methods of JwtService that you use
            sign: jest.fn(() => 'mockJwtToken'),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            // Mock the methods of PrismaService that you use
          },
        },
        // Add other providers as needed
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
