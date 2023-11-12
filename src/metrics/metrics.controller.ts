import { Controller, Get, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PrometheusController } from '@willsoto/nestjs-prometheus';
import { Response } from 'express';

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController extends PrometheusController {
  @ApiOkResponse({ description: 'Returns metrics to be used by Prometheus.' })
  @Get()
  getMetrics(@Res({ passthrough: true }) response: Response) {
    return super.index(response);
  }
}
