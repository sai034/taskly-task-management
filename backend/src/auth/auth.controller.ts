import { Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('guest')
  @HttpCode(200)
  guest() {
    return this.auth.loginAsGuest();
  }

  @Post('google')
  @HttpCode(200)
  google() {
    return this.auth.loginWithGoogle();
  }
}
