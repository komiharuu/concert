import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty({ message: '공연 이름을 입력해주세요.' })
  show_name: string;

  @IsNumber()
  @IsNotEmpty({ message: '좌석 개수를 입력해주세요.' })
  reservation_seat_num: number;

  @IsNotEmpty({ message: '날짜를 입력해주세요.' })
  showDateTime: Date;
}
