import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UserAccessToken } from './type/user-access-token.type';
import { UserRerfreshToken } from './type/user-refresh-token.type';
import { ExtractJWT } from './type/extract-jwt.type';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async extractJWTAccessToken(jwt: string): Promise<ExtractJWT> {
    let payload: ExtractJWT;
    try {
      const userMetadata = await this.jwtService.verifyAsync(jwt);
      payload = {
        isSuccess: true,
        currentUserMetadata: userMetadata,
      };
    } catch (error) {
      payload = {
        isSuccess: false,
        error: error?.message,
      };
    }
    return payload;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const { password, ...user } = await this.userService.findUserByEmail(email);
    if (user && pass === password) return user;
    return null;
  }

  async register(registerDto: RegisterDto) {
    return await this.userService.create(registerDto);
  }

  async getLoginToken({ id, email }: Partial<User>) {
    const accessTokenPayload: UserAccessToken = {
      sub: id,
      email,
      scope: 'ACCESS TOKEN',
    };
    const refreshTokenPayload: UserRerfreshToken = {
      sub: id,
      email,
      scope: 'REFRESH TOKEN',
    };

    const accessToken = await this.jwtService.signAsync(accessTokenPayload);
    const refrsehToken = await this.jwtService.signAsync(refreshTokenPayload, {
      expiresIn: '3h',
    });

    return { accessToken, refrsehToken };
  }
}
