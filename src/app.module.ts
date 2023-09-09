import { Module } from '@nestjs/common';
import { UntisModule } from './untis/untis.module';
import { ClassesModule } from './classes/classes.module';
import { ConfigModule } from '@nestjs/config';
import { SubjectsModule } from './subjects/subjects.module';
import { LessonsModule } from './lessons/lessons.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UntisModule,
    ClassesModule,
    SubjectsModule,
    LessonsModule,
  ],
})
export class AppModule {}
