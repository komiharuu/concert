import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from './entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from 'src/shows/entities/show.entity';
import { ShowSeat } from 'src/shows/entities/show-seat.entity';
import { User } from 'src/user/entities/user.entity';
import { ShowTime } from 'src/shows/entities/show-time.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Show, ShowSeat, User, ShowTime]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
