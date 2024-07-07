import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReservationDto {
  @IsNumber()
  @IsNotEmpty({ message: '공연 id를 입력해주세요.' })
  show_id: number;

  @IsNumber()
  @IsNotEmpty({ message: '좌석 개수를 입력해주세요.' })
  reservation_seat_num: number;

  @IsNotEmpty({ message: '공연 시간을 입력해주세요.' })
  show_date_time: Date;
}
