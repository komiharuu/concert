import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from '../types/userRole.type';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  nick_name: string;

  @Column({ type: 'int', default: 1000000, nullable: true })
  point: number;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
}
