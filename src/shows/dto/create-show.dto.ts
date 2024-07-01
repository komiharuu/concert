import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShowDto {
  @IsString()
  @IsNotEmpty({ message: '공연 이름을 입력해주세요.' })
  showname: string;

  @IsString()
  @IsNotEmpty({ message: '공연 설명을 입력해주세요.' })
  explain: string;

  @IsString()
  @IsNotEmpty({ message: '공연 카테고리를 입력해주세요.' })
  category: string;

  @IsString()
  @IsNotEmpty({ message: '공연 장소를 입력해주세요.' })
  location: string;

  @IsString()
  @IsNotEmpty({ message: '공연 가격을 입력해주세요.' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: '공연 사진을 입력해주세요.' })
  image: string;

  @IsString()
  @IsNotEmpty({ message: '공연 날짜를 입력해주세요.' })
  dates: string[];

  @IsString()
  @IsNotEmpty({ message: '공연 좌석 정보를 입력해주세요.' })
  seat_information: string[];
}
