import { Test, TestingModule } from '@nestjs/testing';
import { ClassesController } from './classes.controller';

describe('ClassesController', () => {
  let controller: ClassesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassesController],
    }).compile();

    controller = module.get<ClassesController>(ClassesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
