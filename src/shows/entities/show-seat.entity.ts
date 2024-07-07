// 사용자가 예매한 예약석 정보 들어가는 엔티티

import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SeatType } from '../types/show-seat.type';
import { Show } from './show.entity';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'showseat',
})
export class ShowSeat {
  @PrimaryGeneratedColumn()
  show_seat_id: number;

  @Column({
    type: 'enum',
    enum: SeatType,
    nullable: false,
    default: SeatType.FREESEAT,
  })
  grade: SeatType;
  // 좌석 비지정 전제하에 default 값을 FREESEAT으로 지정

  @Column({ type: 'int' })
  show_id: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  number: number;
  // 지정석 번호

  @Column({ type: 'int', nullable: true })
  seat_price: number;

  @CreateDateColumn({ select: false })
  @Exclude()
  created_at: Date;

  @UpdateDateColumn({ select: false })
  @Exclude()
  updated_at: Date;

  @ManyToOne(() => Show, (shows) => shows.show_seat)
  @JoinColumn({ name: 'show_id' })
  shows: Show;
}
