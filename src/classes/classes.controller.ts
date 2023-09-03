import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  CacheTTL,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UntisService } from 'src/untis/untis.service';
import { GetClassDto } from './dto/get-class.dto';

@ApiTags('classes')
@UseInterceptors(CacheInterceptor)
@CacheTTL(30)
@Controller('classes')
export class ClassesController {
  constructor(private readonly untisService: UntisService) {}

  @ApiOkResponse({
    description:
      'The classes of the (currently latest) schoolyear are returned.',
    type: [GetClassDto],
  })
  @Get()
  async getClasses() {
    return await this.untisService.fetchClasses();
  }

  @ApiOkResponse({
    description: 'The requested class is returned.',
    type: GetClassDto,
  })
  @ApiNotFoundResponse({ description: 'The requested class was not found.' })
  @Get(':id')
  async getClass(@Param('id', ParseIntPipe) id: number) {
    const targetClass = (await this.untisService.fetchClasses()).find(
      (c) => c.id === id,
    );

    if (!targetClass)
      throw new HttpException('Class not found.', HttpStatus.NOT_FOUND);

    return targetClass;
  }
}
