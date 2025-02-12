import { Body, Controller, HttpStatus, Next, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { CreateUserDto } from './dtos/create-user-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    if (await this.authService.register(createUserDto))
      return { message: 'register is succesful', status: HttpStatus.CREATED };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const response = await this.authService.login(loginUserDto);
    return { message: response };
  }
}
