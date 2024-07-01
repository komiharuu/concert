import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/types/userRole.type';
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ShowService } from './shows.service';
import { CreateShowDto } from './dto/create-show.dto';

@UseGuards(RolesGuard)
@Controller('shows')
export class ShowsController {
  constructor(private readonly showsService: ShowService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createShowDto: CreateShowDto) {
    return this.showsService.createShow(
      createShowDto.showname,
      createShowDto.explain,
      createShowDto.location,
      createShowDto.price,
      createShowDto.image,
      createShowDto.dates,
      createShowDto.seat_information,
    );
  }

  @Get()
  findAll() {
    return this.showsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showsService.findOne(+id);
  }
}
