import { Module } from '@nestjs/common';
import { UntisModule } from './untis/untis.module';
import { ClassesModule } from './classes/classes.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { SubjectsModule } from './subjects/subjects.module';
import { LessonsModule } from './lessons/lessons.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true, ttl: 30_000 }),
    UntisModule,
    ClassesModule,
    SubjectsModule,
    LessonsModule,
  ],
})
export class AppModule {}
