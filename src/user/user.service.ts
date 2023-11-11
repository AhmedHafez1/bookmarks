import { Get, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  @Get()
  findOne(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
