import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 회원가입- 역할을 미리 받도록 하였습니다. 본인이 담당자일 수도 있고 사용자일 수도 있기 때문입니다
  @Post('/auth/signup')
  @UsePipes(ValidationPipe)
  async register(@Body() loginDto: LoginDto) {
    return await this.userService.register(
      loginDto.email,
      loginDto.password,
      loginDto.nick_name,
      loginDto.role,
    );
  }

  // 로그인
  @Post('/auth/signin')
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto.email, loginDto.password);
  }

  // 아이디로 유저 정보 조회
  @Get('/profile/:userId')
  async findOne(@Param('userId') userId: number) {
    return await this.userService.findOne(userId);
  }
}
