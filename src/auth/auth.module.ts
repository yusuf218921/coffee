import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service.spec';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
