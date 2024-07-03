import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(
    @Body() createReservationDto: CreateReservationDto,
    @UserInfo() user: User,
  ) {
    return this.reservationService.createReservation(
      createReservationDto,
      user,
    );
  }

  @Get(':userId')
  findAll(userId: number) {
    return this.reservationService.findAllReservation(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(+id);
  }
}
// passport req.user( UserInfo가 하는 역할)
