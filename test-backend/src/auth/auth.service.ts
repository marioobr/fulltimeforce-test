import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signIn(userName: string, password: string): object {
    return {
      user: userName ?? 'marioobr',
      password: password ?? 'test',
    };
  }
}
