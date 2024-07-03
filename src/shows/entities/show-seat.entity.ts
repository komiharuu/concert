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

  @Column()
  show_id: number;
  // 여기서 number는 int를 뜻한다.

  @Column({
    type: 'enum',
    enum: SeatType,
    nullable: false,
  })
  grade: SeatType;

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
