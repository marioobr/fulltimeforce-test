import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './Dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signin')
  signIn(@Body() body: AuthDto): object {
    const userName: string = body.userName;
    const password: string = body.password;
    return this.authService.signIn(userName, password);
  }
}
