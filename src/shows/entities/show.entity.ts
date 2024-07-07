import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Category } from '../types/show.type';
import { User } from 'src/user/entities/user.entity';
import { ShowSeat } from './show-seat.entity';
import { ShowTime } from './show-time.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { SeatType } from '../types/show-seat.type';

@Entity({
  name: 'shows',
})
export class Show {
  @PrimaryGeneratedColumn()
  show_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'varchar', nullable: false })
  show_name: string;

  @Column({ type: 'text', nullable: false })
  explain: string;

  @Column({
    type: 'enum',
    enum: Category,
    nullable: false,
  })
  category: Category;

  @Column({
    type: 'enum',
    enum: SeatType,
    nullable: false,
    default: SeatType.FREESEAT,
  })
  grade: SeatType;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({ type: 'varchar', nullable: false })
  image: string;

  @Column({ type: 'int', nullable: false })
  price: number;
  // 자유석 기준 가격

  @Column({ type: 'int', nullable: false })
  fixed_num: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ShowSeat, (show_seat) => show_seat.shows)
  show_seat: ShowSeat[];

  @OneToMany(() => ShowTime, (show_time) => show_time.shows)
  show_time: ShowTime[];

  @ManyToOne(() => User, (user) => user.show)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: User;

  @OneToMany(() => Reservation, (reservation) => reservation.show)
  reservations: Reservation[];
}
