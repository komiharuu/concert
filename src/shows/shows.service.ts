import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show)
    private showRepository: Repository<Show>,
  ) {}
  async createShow(
    showname: string,
    explain: string,
    location: string,
    price: number,
    image: string,
    dates: string[],
    seat_information: string[],
  ) {
    const show = await this.showRepository.save({
      showname,
      explain,
      location,
      price,
      image,
      dates,
      seat_information,
    });

    return { show };
  }

  findAll() {
    return `This action returns all shows`;
  }

  findOne(id: number) {
    return `This action returns a #${id} show`;
  }
}
