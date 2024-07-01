import { Test, TestingModule } from '@nestjs/testing';
import { ShowsController } from './shows.controller';
import { ShowService } from './shows.service';

describe('ShowsController', () => {
  let controller: ShowsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowsController],
      providers: [ShowService],
    }).compile();

    controller = module.get<ShowsController>(ShowsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
