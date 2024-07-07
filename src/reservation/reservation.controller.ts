import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationDto } from './dto/reservation.dto';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

// 예약의 모든 서비스는 jwt 인증이 필요해야 가능합니다
@UseGuards(AuthGuard('jwt'))
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // 예약 생성

  // 좌석 지정 예매 시스템
  @Post()
  priorityReservation(
    @Body() reservationDto: ReservationDto,
    @UserInfo() user: User,
  ) {
    return this.reservationService.priorityReservation(reservationDto, user);
  }

  // 공연별 예약석 조회

  @Get()
  findShowSeat(@Query('show_id') show_id: number) {
    return this.reservationService.findShowSeatByShowId(show_id);
  }

  // 사용자가 예약한 목록 조회
  @Get('/:user_id')
  findAllReservation(@Param('user_id') user_id: number) {
    return this.reservationService.findAllReservation(user_id);
  }
}
