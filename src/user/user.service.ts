import { compare, hash } from 'bcrypt';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './types/userRole.type';
import { User } from './entities/user.entity';
import { Provider } from './types/user-provider.type';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findOne(user_id: number) {
    return await this.userRepository.findOneBy({ user_id });
  }

  async register(
    email: string,
    password: string,
    nick_name: string,
    role: Role,
  ) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        '이미 해당 이메일로 가입된 사용자가 있습니다!',
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await this.userRepository.save({
      email,
      password: hashedPassword,
      nick_name,
      role,
    });
    delete newUser.password;
    return { newUser };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['user_id', 'email', 'password'],
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호를 확인해주세요.');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호를 확인해주세요.');
    }

    const payload = { email, userId: user.user_id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_SECRET_KEY'),
      expiresIn: this.configService.get<string>('REFRESH_EXPIRES_IN'),
    });

    const saltOrRounds = 10;
    const hashedRefreshToken = await hash(refreshToken, saltOrRounds);

    let findRefreshToken = await this.refreshTokenRepository.findOne({
      where: { user_id: user.user_id },
    });
    if (!findRefreshToken) {
      findRefreshToken = new RefreshToken();
      findRefreshToken.user_id = user.user_id;
    }
    // 정보를 알려준다.
    findRefreshToken.refresh_token = hashedRefreshToken;
    // 있으면 변경 없으면 생성
    await this.refreshTokenRepository.save(findRefreshToken);

    return {
      status: 200,
      user_id: payload.userId,
      accessToken,
      refreshToken,
    };
  }

  // 카카오 로그인
  generateAccessToken(user: User): string {
    const payload = {
      userId: user.user_id,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }

  async kakaoValidateUser(email: string, nick_name: string): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { email },
    }); // 단일 유저 조회

    if (!user) {
      // 회원 가입 로직
      const newUser = this.userRepository.create({
        provider: Provider.KAKAO,
        nick_name,
        email,
      });
      user = await this.userRepository.save(newUser);
    }
    return user;
  }

  async getJWT(email: string, nick_name: string) {
    const user = await this.kakaoValidateUser(email, nick_name); // 카카오 정보 검증 및 회원가입 로직
    const accessToken = this.generateAccessToken(user); // AccessToken 생성
    return { accessToken };
  }
}
