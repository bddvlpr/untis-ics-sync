import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { UntisModule } from 'src/untis/untis.module';
import { BullModule } from '@nestjs/bull';
import { LessonsProcessor } from './lessons.processor';

@Module({
  providers: [LessonsService, LessonsProcessor],
  controllers: [LessonsController],
  imports: [
    UntisModule,
    BullModule.registerQueue({
      name: 'lessons-queue',
      settings: {
        stalledInterval: 5,
      },
    }),
  ],
})
export class LessonsModule {}
