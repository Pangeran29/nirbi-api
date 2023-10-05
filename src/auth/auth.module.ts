import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, GoogleStrategy],
  imports: [UserModule, PassportModule],
})
export class AuthModule {}
