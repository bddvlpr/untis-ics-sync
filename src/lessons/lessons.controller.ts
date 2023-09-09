import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';

@ApiTags('lessons')
@UseInterceptors(CacheInterceptor)
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}
}
