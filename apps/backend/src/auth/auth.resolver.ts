import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

import { hashPassword, verifyPassword } from 'src/_helpers/password.helper';
import { PrismaService } from 'src/prisma/prisma.service';

import { AuthLoginDto, AuthRegisterDto } from './auth.dto';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  @Mutation()
  async login(
    @Args('input') args: AuthLoginDto,
  ): Promise<{ access_token: string; username: string }> {
    const user = await this.prisma.user.findFirst({
      where: { username: args.username },
    });
    if (!user) {
      throw new UnauthorizedException('Username/Password incorrect');
    }

    const verified = await verifyPassword(user.password, args.password);
    if (!verified) {
      throw new UnauthorizedException('Username/Password incorrect');
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      username: user.username,
    };
  }

  @Mutation()
  async register(@Args('input') args: AuthRegisterDto): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { username: args.username },
    });
    if (user) {
      throw new ConflictException('Username is existing');
    }

    await this.prisma.user.create({
      data: {
        username: args.username,
        password: await hashPassword(args.password),
      },
    });

    return true;
  }
}
