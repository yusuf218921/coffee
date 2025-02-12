import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.entity';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dtos/create-user-dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/auth/dtos/login-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<Boolean> {
    const user = await this.findByEmail(loginUserDto.email);
    if (!user) throw new UnauthorizedException('User not Found');

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.passwordHash,
    );
    return isPasswordValid;
  }

  async createUser(createUserDto: CreateUserDto): Promise<Boolean> {
    const existingUser = await this.userModel
      .findOne({
        $or: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      })
      .exec();

    if (existingUser) {
      throw new Error('The email or password you entered is already in use');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );
    const newUser = new this.userModel({
      ...createUserDto,
      passwordHash: hashedPassword,
    });
    await newUser.save();
    return true;
  }
}
