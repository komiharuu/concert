import { Module } from '@nestjs/common';
import { ShowService } from './shows.service';
import { ShowController } from './show.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { ShowSeat } from './entities/show-seat.entity';
import { ShowTime } from './entities/show-time.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show, ShowSeat, ShowTime])],
  controllers: [ShowController],
  providers: [ShowService],
})
export class ShowsModule {}
