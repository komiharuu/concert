import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Show } from './show.entity';

@Entity({
  name: 'showtime',
})
export class ShowTime {
  @PrimaryGeneratedColumn()
  show_time_id: number;

  @Column({ type: 'int' })
  show_id: number;

  @Column({
    type: 'simple-array',
    nullable: false,
  })
  show_date_time: Date[];

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @ManyToOne(() => Show, (shows) => shows.show_time)
  @JoinColumn({ name: 'show_id' })
  shows: Show;
}
