import { UserModule } from 'src/user/user.module';

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';

@Module({
  // 유저 등록하는 모듈 삽입
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        expiresIn: config.get('JWT_EXPIRATION_TIME'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
