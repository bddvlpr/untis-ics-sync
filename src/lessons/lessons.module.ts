import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { UntisModule } from 'src/untis/untis.module';

@Module({
  providers: [LessonsService],
  controllers: [LessonsController],
  imports: [UntisModule],
})
export class LessonsModule {}
