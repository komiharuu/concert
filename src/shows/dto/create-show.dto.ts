import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { Category } from '../types/show.type';
import { SeatType } from '../types/show-seat.type';
import { Type } from 'class-transformer';

export class CreateShowDto {
  @IsString()
  @IsNotEmpty({ message: '공연 이름을 입력해주세요.' })
  show_name: string;

  @IsString()
  @IsNotEmpty({ message: '공연 설명을 입력해주세요.' })
  explain: string;

  @IsEnum(Category, { message: '올바른 공연 카테고리를 입력해주세요.' })
  category: Category;

  @IsString()
  @IsNotEmpty({ message: '공연 장소를 입력해주세요.' })
  location: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: '공연 가격을 입력해주세요.' })
  price: number;

  @IsEnum(SeatType, { message: '올바른 공연 좌석 정보를 입력해주세요.' })
  grade: SeatType;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: '총 좌석 개수를 입력해주세요.' })
  total_seat_num: number;

  @IsString()
  @IsNotEmpty({ message: '날짜를 입력해주세요.' })
  show_date_time: string[];
}
