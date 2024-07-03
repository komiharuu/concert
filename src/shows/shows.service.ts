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

  // 여기 userId 왜안나오나요
  // 좌석정보랑 날짜는 여러개라 배열로 처리합니다.
  // save 안쪽에는 create로 만들어진 객체가 있다. create 안에 레포지토리 showid가 필요하다 create 하면서 같이 넣어줘야 한다.
  async createQueryRunner(CreateShowDto, user: User) {
    const {
      show_name,
      explain,
      category,
      location,
      image,
      price,
      seat_num,
      grade,
      showDateTime,
    } = CreateShowDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const show = await queryRunner.manager.save(Show, {
        show_name,
        explain,
        location,
        category,
        image,
        price,
        seat_num,
        user_id: user.user_id,
      });
      const showSeat = await queryRunner.manager.save(ShowSeat, {
        show_id: show.show_id,
        grade: grade,
      });
      const showTime = await queryRunner.manager.save(ShowTime, {
        show_id: show.show_id,
        showDateTime: showDateTime,
      });
      await queryRunner.commitTransaction();
      return {
        newshow: {
          grade: showSeat.grade,
          showDateTime: showTime.showDateTime,
          show,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async searchShowName(show_name: string): Promise<Show[]> {
    if (_.isNil(show_name)) {
      throw new NotFoundException('공연을 찾을 수 없습니다.');
    }
    return await this.showRepository.find({
      where: { show_name },
    });
  }

  // 예매 가능 여부를 확인하려고 좌석 수를 가져옵니다. id로 공연 상세조회
  async findShowById(show_id: number) {
    const show = await this.showRepository.findOne({ where: { show_id } });

    // 예매 가능 여부를 if문으로 입력합니다.
    if (show.seat_num > 0) {
      return { message: '예매 가능합니다.', show };
    } else {
      return { message: '예매할 좌석이 없습니다.' };
    }
  }

  async findAllShow(): Promise<Show[]> {
    return await this.showRepository.find();
  }

  async findShowCategory(category: Category): Promise<Show[]> {
    if (!category) {
      throw new NotFoundException('카테고리에 해당하는 공연이 없습니다.');
    }

    return await this.showRepository.find({
      where: { category },
    });
  }
}
