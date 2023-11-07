import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() authDto: AuthDto) {
    return authDto;
  }

  @Post('login')
  login() {
    return this.authService.login();
  }
}
