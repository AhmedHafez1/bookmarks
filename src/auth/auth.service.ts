import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup() {
    return 'Signed up';
  }
  login() {
    return 'Logged in';
  }
}
