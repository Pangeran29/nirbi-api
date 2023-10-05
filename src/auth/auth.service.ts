import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { AuthMethod, User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService
  ) { }

  async validateUser(email: string, pass?: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    delete user.password;
    if (user.auth_method === AuthMethod.GOOGLE_OAUTH) {
      return user;
    } else if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  async register(registerDto: RegisterDto) {
    return await this.userService.create(registerDto);
  }

  async login(user: User) {
    return { token: "abcdflkas adsfjd adsfjadsf askdfj ad" };
  }
}
