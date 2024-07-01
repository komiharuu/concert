import { Module } from '@nestjs/common';
import { ShowService } from './shows.service';
import { ShowsController } from './shows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show])],
  controllers: [ShowsController],
  providers: [ShowService],
})
export class ShowsModule {}
