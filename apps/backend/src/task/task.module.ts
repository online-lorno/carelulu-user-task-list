import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';

import { TaskController } from './task.controller';
import { TaskResolver } from './task.resolver';

@Module({
  imports: [PrismaModule],
  controllers: [TaskController],
  providers: [TaskResolver],
})
export class TaskModule {}
