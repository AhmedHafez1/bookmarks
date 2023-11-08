import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() user: CreateUserDto) {
    return this.authService.signup(user);
  }

  @Post('login')
  login() {
    return this.authService.login();
  }
}
