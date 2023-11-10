import { PrismaService } from './../prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

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

  async login(userDto: LoginUserDto): Promise<{
    id: number;
    access_token: string;
  }> {
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

    return this.getAccessToken(user.id, user.email);
  }

  async getAccessToken(
    id,
    email,
  ): Promise<{ id: number; access_token: string }> {
    const payload = { id, email };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '2d',
      secret: this.config.get('JWT_SECRET'),
    });

    return { id, access_token };
  }
}
