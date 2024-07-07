import { PartialType } from '@nestjs/mapped-types';
import { ReservationDto } from './reservation.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { SeatType } from 'src/shows/types/show-seat.type';

export class PriorityReservationDto extends PartialType(ReservationDto) {
  @IsNumber()
  @IsNotEmpty({ message: '공연 id를 입력해주세요.' })
  show_id: number;

  @IsNumber()
  show_seat_num: number;

  @IsNumber()
  @IsNotEmpty({ message: '좌석 가격을 입력해주세요.' })
  seat_price: number;

  grade: SeatType;

  @IsNumber()
  @IsNotEmpty({ message: '예약할 좌석 개수를 입력해주세요.' })
  reservation_seat_num: number;

  @IsNotEmpty({ message: '공연 시간을 입력해주세요.' })
  show_date_time: Date;
}
