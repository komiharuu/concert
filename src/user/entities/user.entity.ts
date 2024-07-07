import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { Role } from '../types/userRole.type';
import { Show } from 'src/shows/entities/show.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Provider } from '../types/user-provider.type';
import { RefreshToken } from './refresh-token.entity';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: true })
  password: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  nick_name: string;

  @Column({ type: 'int', default: 1000000 })
  point: number;

  @Column({ type: 'enum', default: 'LOCAL', enum: Provider })
  provider: Provider;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Show, (shows) => shows.user)
  show: Show[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservation: Reservation[];

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refresh_token: RefreshToken;
}
