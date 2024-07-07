import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Entity,
} from 'typeorm';

import { User } from './user.entity';

@Entity({
  name: 'refresh_token',
})
export class RefreshToken {
  @PrimaryGeneratedColumn()
  token_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'varchar', unique: true, nullable: true })
  refresh_token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User, (user) => user.refresh_token)
  user: User;
}
