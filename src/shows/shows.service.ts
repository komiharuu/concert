import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import _ from 'lodash';
import { NotFoundException } from '@nestjs/common';
import { Category } from './types/show.type';
import { ShowSeat } from './entities/show-seat.entity';
import { ShowTime } from './entities/show-time.entity';
import { User } from 'src/user/entities/user.entity';
import { AwsService } from './aws/aws.service';
import { Like } from 'typeorm';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show)
    private showRepository: Repository<Show>,
    @InjectRepository(ShowSeat)
    private showseatRepository: Repository<ShowSeat>,
    @InjectRepository(ShowTime)
    private showtimeRepository: Repository<ShowTime>,
    private dataSource: DataSource,
    private awsService: AwsService,
  ) {}

  async createQueryRunner(
    CreateShowDto,
    user: User,
    file: Express.Multer.File,
  ) {
    const {
      show_name,
      explain,
      category,
      location,
      price,
      total_seat_num,
      grade,
      show_date_time,
    } = CreateShowDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    // s3, multer로 공연 이미지 업로드
    try {
      const { originalname } = file;
      const fileName = `${originalname}`;
      const ext = originalname.split('.').pop();
      const image = await this.awsService.imageUploadToS3(fileName, file, ext);

      const show = await queryRunner.manager.save(Show, {
        show_name,
        explain,
        location,
        category,
        image,
        price,
        grade,
        total_seat_num,
        user_id: user.user_id,
      });

      const showTime = await queryRunner.manager.save(ShowTime, {
        show_id: show.show_id,
        show_date_time: show_date_time,
      });
      await queryRunner.commitTransaction();
      return {
        newshow: {
          show_date_time: showTime.show_date_time,
          show,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // 검색 서비스- 이름이나 카테고리
  async searchShowName(show_name: string, category: Category): Promise<Show[]> {
    // 둘중 하나만 알아도 검색 가능함
    if (_.isNil(show_name || category)) {
      throw new NotFoundException('해당하는 공연을 찾을 수 없습니다.');
    }
    // Like: 공연이름 일부만 검색해도 찾을 수 있다.
    return await this.showRepository.find({
      where: [{ show_name: Like(`%${show_name}%`) }, { category }],
    });
  }

  // 공연 상세조회 api
  async findShowById(show_id: number) {
    const show = await this.showRepository.findOne({ where: { show_id } });

    // 예매 가능 여부를 확인하려고 좌석 수를 가져옵니다. 예매 가능 여부를 if문으로 입력합니다.
    if (show.fixed_num > 0) {
      return { message: '예매 가능합니다.', show };
    } else {
      return { message: '예매할 좌석이 없습니다.' };
    }
  }

  // 전체 목록 조회
  async findAllShow(): Promise<Show[]> {
    return await this.showRepository.find();
  }
}
