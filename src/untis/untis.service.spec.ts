import { Test, TestingModule } from '@nestjs/testing';
import { UntisService } from './untis.service';

describe('UntisService', () => {
  let service: UntisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UntisService],
    }).compile();

    service = module.get<UntisService>(UntisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
