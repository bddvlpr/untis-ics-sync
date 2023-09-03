import { Module } from '@nestjs/common';
import { UntisModule } from 'src/untis/untis.module';
import { ClassesController } from './classes.controller';

@Module({
  controllers: [ClassesController],
  imports: [UntisModule],
})
export class ClassesModule {}
