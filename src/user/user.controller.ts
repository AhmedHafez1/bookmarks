import { Controller, Get, UseGuards } from '@nestjs/common';
import { User as UserEntity } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/shared/decorators/user.decorator';

@Controller('user')
export class UserController {
  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@User() user: UserEntity) {
    return user;
  }
}
