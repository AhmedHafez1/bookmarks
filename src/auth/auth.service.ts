import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async signup(user: CreateUserDto): Promise<CreateUserDto> {
    const { name, password, age, email } = user;

    const hash = await bcrypt.hash(password, 10);

    const createdUser = await this.prismaService.user.create({
      data: {
        name,
        email,
        age,
        password: hash,
      },
      select: { id: true, name: true, email: true, age: true },
    });

    return createdUser;
  }

  login() {
    return 'Logged in';
  }
}
