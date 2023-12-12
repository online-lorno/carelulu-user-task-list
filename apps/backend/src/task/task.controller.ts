import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Task } from '@prisma/client';

import { AuthRestGuard } from 'src/auth/auth.rest.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUserPayload } from 'src/user/user';
import { CurrentUser } from 'src/user/user.decorator';

import { TaskCreateDto, TaskUpdateDto } from './task.dto';

@UseGuards(AuthRestGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async get(@CurrentUser() currentUser: IUserPayload): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId: currentUser.sub },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Post()
  async post(
    @Body() args: TaskCreateDto,
    @CurrentUser() currentUser: IUserPayload,
  ): Promise<Task> {
    return this.prisma.task.create({
      data: {
        userId: currentUser.sub,
        note: args.note,
        date: args.date,
      },
    });
  }

  @Patch(':id')
  async patch(
    @Body() args: TaskUpdateDto,
    @Param() params: Record<string, string>,
    @CurrentUser() currentUser: IUserPayload,
  ): Promise<Task> {
    const id = params.id;
    const task = await this.prisma.task.findUnique({
      where: { id, userId: currentUser.sub },
    });
    if (!task) {
      throw new NotFoundException();
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        note: args.note,
        date: args.date,
      },
    });
  }

  @Delete(':id')
  async delete(
    @Param() params: Record<string, string>,
    @CurrentUser() currentUser: IUserPayload,
  ): Promise<Task> {
    const id = params.id;
    const task = await this.prisma.task.findUnique({
      where: { id, userId: currentUser.sub },
    });
    if (!task) {
      throw new NotFoundException();
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
