import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../types/show.type';

@Entity({
  name: 'shows',
})
export class Show {
  @PrimaryGeneratedColumn()
  showId: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  showname: string;

  @Column({ type: 'text', nullable: false })
  explain: string;

  @Column({
    type: 'enum',
    enum: Category,
    default: Category.CONCERT,
    nullable: false,
  })
  category: Category;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'varchar', nullable: false })
  image: string;

  @Column({ type: 'simple-array', nullable: false })
  dates: string[];

  @Column({ type: 'simple-array', nullable: false })
  seat_information: string[];
  // 좌석 정보와 개수를 다 담을 수 있도록 배열을 사용하였습니다.
}
