import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Show } from 'src/shows/entities/show.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({
  name: 'reservation',
})
export class Reservation {
  @PrimaryGeneratedColumn()
  reservation_id: number;

  @Column()
  show_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'int', default: 0 })
  reservation_seat_num: number;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @ManyToOne(() => Show, (shows) => shows.reservations)
  @JoinColumn({ name: 'show_id' })
  show: Show;

  @ManyToOne(() => User, (users) => users.reservation)
  @JoinColumn({ name: 'user_id' })
  users: User;
}
