import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';

import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthResolver],
})
export class AuthModule {}
