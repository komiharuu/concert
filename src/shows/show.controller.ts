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
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('shows')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  // 공연 생성
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createShowDto: CreateShowDto,
    @UserInfo() user_id: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.showService.createQueryRunner(createShowDto, user_id, file);
  }

  // 공연 전체조회
  @Get()
  async findAll() {
    return await this.showService.findAllShow();
  }

  // 공연 검색 + 이름, 카테고리
  @Get('/search')
  async searchShowname(
    @Query('showname') showname: string,
    @Query('category') category: Category,
  ) {
    const searchShow = await this.showService.searchShowName(
      showname,
      category,
    );
    return searchShow;
  }

  // 공연 상세조회
  @Get('/:showId')
  async findShowById(@Param('showId') showId: number) {
    const show = await this.showService.findShowById(showId);
    return show;
  }

  // param 여러개 앞의 부분 이름을 다르게 지어라. 경로설정이 중요하다.
}
