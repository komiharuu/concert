import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { Category } from '../types/show.type';
import { SeatType } from '../types/show-seat.type';

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

  @IsNumber()
  @IsNotEmpty({ message: '공연 가격을 입력해주세요.' })
  price: number;

  @IsEnum(SeatType, { message: '올바른 공연 좌석 정보를 입력해주세요.' })
  grade: SeatType;

  @IsString()
  @IsNotEmpty({ message: '공연 사진을 입력해주세요.' })
  image: string;

  @IsNumber()
  @IsNotEmpty({ message: '좌석 개수를 입력해주세요.' })
  seat_num: number;

  @IsNotEmpty({ message: '날짜를 입력해주세요.' })
  showDateTime: Date[];
  //  얘 출력값에서 빼고싶다. 어떻게 해야되나?
}
