import { PrismaService } from './../prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(user: CreateUserDto): Promise<CreateUserDto> {
    const { name, password, age, email } = user;

    const hash = await bcrypt.hash(password, 10);

    try {
      const createdUser = await this.prisma.user.create({
        data: {
          name,
          email,
          age,
          password: hash,
        },
        select: { id: true, name: true, email: true, age: true },
      });

      return createdUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already in use!');
        }
      }
      throw error;
    }
  }

  async login(userDto: LoginUserDto) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { email: userDto.email },
    });

    const passwordCorrect = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (!passwordCorrect) {
      throw new UnauthorizedException('Password is not correct!');
    }

    delete user.password;

    return user;
  }
}
