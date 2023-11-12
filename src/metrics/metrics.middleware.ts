import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Request, Response } from 'express';
import { Counter, Summary } from 'prom-client';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(
    @InjectMetric('uis_request_count')
    private readonly requestCountMetric: Counter,
    @InjectMetric('uis_request_duration')
    private readonly requestDurationMetric: Summary,
  ) {}

  use(_req: Request, res: Response, next: () => void) {
    this.requestCountMetric.inc();
    const end = this.requestDurationMetric.startTimer();
    res.on('finish', () => end());
    next();
  }
}
