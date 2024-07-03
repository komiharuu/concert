import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Show } from './show.entity';

@Entity({
  name: 'showtime',
})
export class ShowTime {
  @PrimaryGeneratedColumn()
  showTimeId: number;

  @Column()
  show_id: number;

  @Column({
    type: 'datetime',
    nullable: false,
  })
  showDateTime: Date[];

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => Show, (shows) => shows.show_time)
  shows: Show;
}
