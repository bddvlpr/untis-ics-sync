import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UntisService } from 'src/untis/untis.service';
import { GetLessonDto } from './dto/get-lesson.dto';
import { LessonsService } from './lessons.service';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(
    private readonly untisService: UntisService,
    private readonly lessonsService: LessonsService,
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
    const lessons = await this.untisService.fetchTimetable(14, 31, classId);
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
  ) {
    const lessons = await this.untisService.fetchTimetable(14, 31, classId);
    if (!lessons)
      throw new HttpException(
        'No lessons found, does class exist?',
        HttpStatus.NOT_FOUND,
      );

    return this.lessonsService.convertToEvents(lessons, {
      includedSubjects,
      excludedSubjects,
      alarms,
    });
  }
}
