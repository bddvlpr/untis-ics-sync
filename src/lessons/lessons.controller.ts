import { InjectQueue } from '@nestjs/bull';
import {
  Controller,
  DefaultValuePipe,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Queue } from 'bull';
import { GetLessonDto } from './dto/get-lesson.dto';
import { FetchData, FetchIcsData } from './lessons.processor';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(
    private readonly configService: ConfigService,
    @InjectQueue('lessons-queue') private readonly lessonsQueue: Queue,
  ) {}

  @ApiOkResponse({
    description: 'The requested lessons of the target class are returned.',
    type: [GetLessonDto],
  })
  @ApiNotFoundResponse({
    description: 'There were no lessons found with the given class id.',
  })
  @Get(':classId')
  async getLessonsForClass(@Param('classId', ParseIntPipe) classId: number) {
    const job = this.lessonsQueue.add('fetch', {
      before: this.configService.get<number>('LESSONS_TIMETABLE_BEFORE', 7),
      after: this.configService.get<number>('LESSONS_TIMETABLE_AFTER', 14),
      classId,
    } as FetchData);

    const lessons = (await job).finished();
    if (!lessons)
      throw new HttpException(
        'No lessons found, does class exist?',
        HttpStatus.NOT_FOUND,
      );

    return lessons;
  }

  @ApiQuery({ name: 'includedSubjects', type: [Number], required: false })
  @ApiQuery({ name: 'excludedSubjects', type: [Number], required: false })
  @ApiQuery({ name: 'alarms', type: [Number], required: false })
  @ApiQuery({ name: 'offset', type: Number, required: false })
  @Header('Content-Type', 'text/calendar')
  @Get(':classId/ics')
  async getICSForClass(
    @Param('classId', ParseIntPipe) classId: number,
    @Query(
      'includedSubjects',
      new ParseArrayPipe({ items: Number, optional: true }),
    )
    includedSubjects?: number[],
    @Query(
      'excludedSubjects',
      new ParseArrayPipe({ items: Number, optional: true }),
    )
    excludedSubjects?: number[],
    @Query('alarms', new ParseArrayPipe({ items: Number, optional: true }))
    alarms?: number[],
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe)
    offset?: number,
  ) {
    const job = this.lessonsQueue.add('fetch-ics', {
      before: this.configService.get<number>('LESSONS_TIMETABLE_BEFORE', 7),
      after: this.configService.get<number>('LESSONS_TIMETABLE_AFTER', 14),
      classId,
      includedSubjects,
      excludedSubjects,
      alarms,
      offset,
    } as FetchIcsData);

    const ics = await (await job).finished();
    if (!ics)
      throw new HttpException(
        'No lessons found, does class exist?',
        HttpStatus.NOT_FOUND,
      );

    return ics;
  }
}
