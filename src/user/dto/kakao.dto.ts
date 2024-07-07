import { IsEmail, IsString } from 'class-validator';

export class KaKaoDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  nick_name: string;
}

//  카카오 로그인에 필요한 정보들
