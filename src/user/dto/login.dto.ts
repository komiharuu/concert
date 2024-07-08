import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../types/userRole.type';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @MinLength(5, { message: '비밀번호는 5자 이상으로 입력해주세요' })
  password: string;

  @IsOptional({ message: '비밀번호를 다시 확인해주세요' })
  passwordConfirm: string;

  // @IsString()
  nick_name: string;

  role: Role;
}
