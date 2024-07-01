import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 다시 확인해주세요' })
  passwordConfirm: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  nick_name: string;
}
