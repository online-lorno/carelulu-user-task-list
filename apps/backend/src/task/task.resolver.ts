import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Task } from '@prisma/client';

import { AuthGraphqlGuard } from 'src/auth/auth.graphql.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUserPayload } from 'src/user/user';
import { CurrentUser } from 'src/user/user.decorator';

import { TaskCreateDto, TaskUpdateDto } from './task.dto';

@UseGuards(AuthGraphqlGuard)
@Resolver('Task')
export class TaskResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query()
  async tasks(@CurrentUser() currentUser: IUserPayload): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId: currentUser.sub },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Mutation()
  async taskCreate(
    @Args('input') args: TaskCreateDto,
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

  @Mutation()
  async taskUpdate(
    @Args('id') id: string,
    @Args('input') args: TaskUpdateDto,
    @CurrentUser() currentUser: IUserPayload,
  ): Promise<Task> {
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

  @Mutation()
  async taskDelete(
    @Args('id') id: string,
    @CurrentUser() currentUser: IUserPayload,
  ): Promise<Task> {
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
