import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UntisService } from 'src/untis/untis.service';
import { GetSubjectDto } from './dto/get-subject.dto';

@ApiTags('subjects')
@UseInterceptors(CacheInterceptor)
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly untisService: UntisService) {}

  @ApiOkResponse({
    description: 'The (visible) subjects are returned.',
    type: [GetSubjectDto],
  })
  @Get()
  async getSubjects() {
    return await this.untisService.fetchSubjects();
  }
}
