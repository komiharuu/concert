import { Module } from '@nestjs/common';
import { ShowService } from './shows.service';
import { ShowController } from './show.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { ShowSeat } from './entities/show-seat.entity';
import { ShowTime } from './entities/show-time.entity';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [TypeOrmModule.forFeature([Show, ShowSeat, ShowTime]), AwsModule],
  controllers: [ShowController],
  providers: [ShowService],
})
export class ShowModule {}
