import { Module } from '@nestjs/common';
import { UntisModule } from './untis/untis.module';
import { ClassesModule } from './classes/classes.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SubjectsModule } from './subjects/subjects.module';
import { LessonsModule } from './lessons/lessons.module';
import { HolidaysModule } from './holidays/holidays.module';
import { MetricsModule } from './metrics/metrics.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('BULL_REDIS_HOST'),
          port: configService.get<number>('BULL_REDIS_PORT'),
          path: configService.get<string>('BULL_REDIS_PATH'),
        },
      }),
    }),
    UntisModule,
    ClassesModule,
    SubjectsModule,
    LessonsModule,
    HolidaysModule,
    MetricsModule,
  ],
})
export class AppModule {}
