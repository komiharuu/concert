import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
  BadRequestException,
} from '@nestjs/common';
import { Show } from 'src/shows/entities/show.entity';
import { ShowSeat } from 'src/shows/entities/show-seat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Reservation } from './entities/reservation.entity';
import { ShowTime } from 'src/shows/entities/show-time.entity';
import _ from 'lodash';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Show)
    private showRepository: Repository<Show>,
    @InjectRepository(ShowSeat)
    private showseatRepository: Repository<ShowSeat>,
    @InjectRepository(ShowTime)
    private showtimeRepository: Repository<ShowTime>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  // 예매 코드
  async createReservation(
    createReservationDto: CreateReservationDto,
    user: User,
  ) {
    const { reservation_seat_num, show_name, showDateTime } =
      createReservationDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // 1. 공연 정보 가져오기
      const show = await queryRunner.manager.findOne(Show, {
        where: { show_name },
      });

      if (!show) {
        throw new NotFoundException(`공연을 찾을 수 없습니다.`);
      }

      // 2. 공연 시간이 입력되었는지 및 유효한지 확인
      const showTime = await queryRunner.manager.findOne(ShowTime, {
        where: { showDateTime },
      });

      if (_.isNil(showTime)) {
        throw new BadRequestException(`유효한 공연 시간을 입력해 주세요.`);
      }

      // 3. 만석 여부 확인
      if (show.seat_num === 0) {
        await queryRunner.manager.save(Show, show);
        throw new BadRequestException(`예약 만료되었습니다.`);
      }

      // 5. 가격 및 포인트 확인
      const showPrice = show.price; // 예약할 공연의 가격
      const userPoints = user.point; // 사용자의 현재 포인트. 가격만큼 차감됩니다.
      const limitPoint = 50000; // 포인트 사용 제한

      if (showPrice > limitPoint) {
        throw new NotAcceptableException(
          `포인트는 최대 5만점까지만 사용 가능합니다.`,
        );
      }

      if (userPoints < showPrice) {
        throw new NotFoundException(
          `보유한 포인트(${userPoints}점)가 부족하여 예약할 수 없습니다.`,
        );
      }

      // 6. 예약 정보 생성 및 저장
      const reservation = await queryRunner.manager.create(Reservation, {
        reservation_seat_num,
        // showDateTime,
        user_id: user.user_id,
        show_id: show.show_id,
      });
      await queryRunner.manager.save(Reservation, reservation);

      // 필수로 입력받지 않거나 entity 문제!

      // 7. 사용자의 포인트 차감
      user.point -= Math.min(showPrice, limitPoint);
      await queryRunner.manager.save(User, user);

      // 8. 좌석 차감 처리
      show.seat_num -= reservation_seat_num;

      // 9. 만석 처리
      if (show.seat_num === 0) {
        return { message: '만석입니다' }; // 모든 좌석이 예약되면 만석 처리
      }

      // 10. 트랜잭션 커밋 및 결과 반환
      await queryRunner.commitTransaction();

      return {
        reservation: reservation.reservation_id,
        show: show,
      };
    } catch (error) {
      // 예외 발생 시 롤백
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 리소스 해제
      await queryRunner.release();
    }
  }

  async findAllReservation(user_id: number): Promise<Reservation[]> {
    const reservation = await this.reservationRepository.find({
      where: { user_id },
    });
    return reservation;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }
}
//질문 드릴 것- 트랜잭션을 이용해 공연을 생성하였는데, 일부 테이블에 showId 값이랑 userId 값이 잘 들어오지 않고 있습니다.
// 출력값을 하나로 묶어서 하고 싶다.
// createdAt이랑 updateAt이 출력되는데, 어떻게 해야되나요
