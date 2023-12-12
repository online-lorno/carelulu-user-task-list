import {
  Body,
  ConflictException,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { jwtConstants } from 'src/_constants/jwt.constant';
import { hashPassword, verifyPassword } from 'src/_helpers/password.helper';
import { PrismaService } from 'src/prisma/prisma.service';

import { AuthLoginDto, AuthRegisterDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(
    @Body() args: AuthLoginDto,
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

  @Post('register')
  async register(@Body() args: AuthRegisterDto): Promise<boolean> {
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

  @Post('verify-token')
  async verifyToken(@Req() request: Request): Promise<boolean> {
    const token = request.cookies[jwtConstants.cookieName];
    try {
      await this.jwtService.verifyAsync(token);
      return true;
    } catch (error) {
      return false;
    }
  }
}
