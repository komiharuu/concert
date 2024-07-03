import { Roles } from 'src/user/auth/roles.decorator';
import { RolesGuard } from 'src/user/auth/roles.guard';
import { Role } from 'src/user/types/userRole.type';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateShowDto } from './dto/create-show.dto';
import { ShowService } from './shows.service';
import { Category } from './types/show.type';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';

@Controller('shows')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  // 공연 생성
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() createShowDto: CreateShowDto, @UserInfo() user_id: User) {
    return this.showService.createQueryRunner(createShowDto, user_id);
  }

  @Get()
  async findAll() {
    return await this.showService.findAllShow();
  }

  @Get('/search')
  async searchShowname(@Query('showname') showname: string) {
    const searchShow = await this.showService.searchShowName(showname);
    return searchShow;
  }

  @Get('/category')
  async findShowCategory(@Body('category') category: Category) {
    const categoryShow = await this.showService.findShowCategory(category);
    return categoryShow;
  }

  @Get('/:showId')
  async findShowById(@Param('showId') showId: number) {
    const show = await this.showService.findShowById(showId);
    return show;
  }
}
