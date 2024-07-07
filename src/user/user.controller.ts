import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  // 회원가입
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
    const user = await this.userService.login(
      loginDto.email,
      loginDto.password,
    );

    return user;
  }

  // 아이디로 유저 정보 조회. 포인트 때문에 jwt 인증 사용
  @Get('/profile/:userId')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('userId') userId: number) {
    return await this.userService.findOne(userId);
  }

  //  카카오 로그인

  @Get('/auth/signin/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(@Req() req: any) {
    const { email, nick_name } = req.user;

    const { accessToken } = await this.userService.getJWT(email, nick_name);
    return {
      status: 200,
      access_token: accessToken,
      nick_name,
    };
  }
}
