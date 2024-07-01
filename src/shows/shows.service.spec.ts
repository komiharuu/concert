import { Test, TestingModule } from '@nestjs/testing';
import { ShowService } from './shows.service';

describe('ShowsService', () => {
  let service: ShowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowService],
    }).compile();

    service = module.get<ShowService>(ShowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
