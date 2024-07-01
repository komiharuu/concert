import { Body, Controller, Get, Post, Param } from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 회원가입
  @Post('signup')
  async register(@Body() loginDto: LoginDto) {
    return await this.userService.register(
      loginDto.email,
      loginDto.password,
      loginDto.nick_name,
    );
  }

  // 로그인
  @Post('signin')
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto.email, loginDto.password);
  }

  // 아이디로 유저 정보 조회
  @Get('profile/:userId')
  async findOne(@Param('userId') userId: number) {
    const user = await this.userService.findOne(userId);
    return {
      userId: user.userId,
      nickname: user.nick_name,
      point: user.point,
    };
  }
}
