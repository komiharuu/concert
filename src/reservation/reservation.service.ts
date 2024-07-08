import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Show } from 'src/shows/entities/show.entity';
import { ShowSeat } from 'src/shows/entities/show-seat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Reservation } from './entities/reservation.entity';
import { ShowTime } from 'src/shows/entities/show-time.entity';
import { ReservationDto } from './dto/reservation.dto';

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

  // 사용자 예약목록 조회
  async findAllReservation(user_id: number): Promise<Reservation[]> {
    const reservations = await this.reservationRepository.find({
      where: { user_id },
      order: { created_at: 'DESC' },
    });
    return reservations;
  }

  // 좌석을 지정한 후 공연 예매하기

  async priorityReservation(reservationDto: ReservationDto, user: User) {
    const {
      show_id,
      number,
      reservation_seat_num,
      show_date_time,
      seat_price,
      grade,
    } = reservationDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 공연 정보를 가져옵니다.
      const show = await queryRunner.manager.findOne(Show, {
        where: { show_id },
      });

      if (!show) {
        throw new NotFoundException(`공연을 찾을 수 없습니다.`);
      }

      // 공연 시간이 입력되었는지 및 유효한지를 확인합니다.
      const showTime = await queryRunner.manager.findOne(ShowTime, {
        where: { show_id, show_date_time },
      });
      if (!showTime) {
        throw new BadRequestException(`유효한 공연 시간을 입력해 주세요.`);
      }
      // 5. 가격 및 포인트 확인
      if (seat_price > 50000) {
        throw new NotAcceptableException(
          `포인트는 최대 5만점까지만 사용 가능합니다.`,
        );
      }

      if (user.point < seat_price) {
        throw new BadRequestException(`포인트가 부족합니다.`);
      }

      // 좌석 가격이 show 정보에 있는 금액 가격보다 높으면 안된다.
      if (seat_price > show.price) {
        throw new BadRequestException(`좌석 금액을 잘못 입력하였습니다.`);
      }
      if (number > show.fixed_num) {
        throw new BadRequestException(`좌석 개수를 잘못 입력하셨습니다.`);
      }

      // 예약석 정보 생성 및 저장

      const existingShowSeat = await queryRunner.manager.findOne(ShowSeat, {
        where: { show_id: show.show_id, number },
      });

      if (existingShowSeat && existingShowSeat.number === number) {
        throw new ConflictException('이미 예약된 좌석입니다');
      }

      const showSeat = queryRunner.manager.create(ShowSeat, {
        number,
        show_id: show.show_id,
        grade,
        seat_price,
      });

      await queryRunner.manager.save(ShowSeat, showSeat);

      // 사용자의 포인트 차감
      user.point -= Math.min(seat_price, 50000);
      await queryRunner.manager.save(User, user);

      const reservation = queryRunner.manager.create(Reservation, {
        reservation_seat_num,
        user_id: user.user_id,
        show_id: show.show_id,
      });

      await queryRunner.manager.save(Reservation, reservation);

      // 좌석 차감 처리. 예약석의 수만큼 차감하게 합니다.
      show.fixed_num -= reservation_seat_num;

      if (show.fixed_num < 0) {
        throw new BadRequestException(`예약 가능한 좌석이 없습니다.`);
      }
      await queryRunner.manager.save(Show, show);
      await queryRunner.commitTransaction();

      return {
        reservation_id: reservation.reservation_id,
        user_id: user.user_id,
        showInfo: {
          show_id: show.show_id,
          show_name: show.show_name,
          explain: show.explain,
          category: show.category,
          location: show.location,
          price: show.price,
          image: show.image,
          fixed_num: show.fixed_num,
          grade: showSeat.grade,
          number: showSeat.number,
        },
        user_point: user.point,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // 공연별 좌석 목록 배열로 받기

  async findShowSeatByShowId(show_id: number): Promise<ShowSeat[]> {
    const reservationseat = await this.showseatRepository.find({
      where: { show_id },
      order: { created_at: 'DESC' },
      select: ['show_id', 'number', 'seat_price', 'grade'],
    });
    return reservationseat;
  }
}
