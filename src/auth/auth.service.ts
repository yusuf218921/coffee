import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { CreateUserDto } from './dtos/create-user-dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(createUserDto: CreateUserDto): Promise<void> {
    this.usersService.createUser(createUserDto);
  }
  async login(loginUserDto: LoginUserDto): Promise<string> {
    if (await this.usersService.validateUser(loginUserDto))
      return 'Login succesful';
    else throw new UnauthorizedException('Invalid credentials');
  }
}
