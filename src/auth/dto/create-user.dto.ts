import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @IsNotEmpty()
  password?: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  age: number;
}
