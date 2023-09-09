import { Module } from '@nestjs/common';
import { UntisModule } from 'src/untis/untis.module';
import { SubjectsController } from './subjects.controller';

@Module({
  controllers: [SubjectsController],
  imports: [UntisModule],
})
export class SubjectsModule {}
