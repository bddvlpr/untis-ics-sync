import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  makeCounterProvider,
  makeSummaryProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import { ClassesController } from 'src/classes/classes.controller';
import { HolidaysController } from 'src/holidays/holidays.controller';
import { LessonsController } from 'src/lessons/lessons.controller';
import { SubjectsController } from 'src/subjects/subjects.controller';
import { MetricsController } from './metrics.controller';
import { MetricsMiddleware } from './metrics.middleware';

@Module({
  imports: [
    PrometheusModule.register({
      controller: MetricsController,
    }),
  ],
  controllers: [MetricsController],
  providers: [
    makeCounterProvider({
      name: 'uis_request_count',
      help: 'The amount of requests processed.',
    }),
    makeSummaryProvider({
      name: 'uis_request_duration',
      help: 'The amount of time taken to process a request.',
    }),
  ],
})
export class MetricsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MetricsMiddleware)
      .forRoutes(
        ClassesController,
        SubjectsController,
        LessonsController,
        HolidaysController,
      );
  }
}
