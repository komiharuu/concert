import { IsEmail, IsNotEmpty, IsEnum, IsString, Min } from 'class-validator';
import { Role } from '../types/userRole.type';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;

  @IsString()
  @Min(5, { message: '비밀번호는 5자 이상으로 입력해주세요' })
  @IsNotEmpty({ message: '비밀번호를 다시 확인해주세요' })
  passwordConfirm: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  nick_name: string;

  @IsEnum(Role, { message: '올바른 역할을 입력해주세요.' })
  role: Role;
}
