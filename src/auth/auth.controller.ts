import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { GoogleOauthGuard } from '@app/common/guard/google-oauth.guard';
import { Response } from 'express';
import { UserGooglePayload } from '@app/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  @ApiOperation({
    description: "Used in client side to redirect to Google Oauth"
  })
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() { }

  @ApiOperation({
    deprecated: true,
    description: "This Api only used in backend side (no need to implement in client side)"
  })
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {    
    const { email, name }: UserGooglePayload = req?.user;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      const registerData = new RegisterDto();
      registerData.email = email;
      registerData.name = name;
      await this.authService.register(registerData);
    }
    const validUser = await this.authService.validateUser(email);
    const userLogin = await this.authService.login(user);
    res.json({ ...validUser, ...userLogin }).status(200);
  }

  @UseGuards(AuthGuard('local'))
  @Post('local-login')
  async login(
    @Req() req,
    @Body() loginDto: LoginDto
  ) {
    const user: User = req?.user;
    const token = await this.authService.login(user);
    return { ...user, ...token };
  }

  @Post('local-register')
  register(@Body() createAuthDto) {
    // return this.authService.create(createAuthDto);
  }
}
