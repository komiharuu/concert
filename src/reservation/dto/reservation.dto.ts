import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Max } from 'class-validator';
import { SeatType } from 'src/shows/types/show-seat.type';

export class ReservationDto {
  @IsNumber()
  @IsNotEmpty({ message: '공연 id를 입력해주세요.' })
  show_id: number;

  @Type(() => Number)
  number: number;

  @Type(() => Number)
  seat_price: number;

  grade: SeatType;

  @Type(() => Number)
  @Max(4, { message: '좌석은 최대 4개까지 예매 가능합니다.' })
  @IsNotEmpty({ message: '예약할 좌석 개수를 입력해주세요.' })
  reservation_seat_num: number;

  @IsNotEmpty({ message: '공연 시간을 입력해주세요.' })
  show_date_time: Date;
}
