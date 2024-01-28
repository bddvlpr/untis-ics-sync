import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UntisService } from 'src/untis/untis.service';
import { LessonsService } from './lessons.service';

export interface FetchData {
  before: number;
  after: number;
  classId: number;
}

export interface FetchIcsData {
  before: number;
  after: number;
  classId: number;
  includedSubjects?: number[];
  excludedSubjects?: number[];
  alarms?: number[];
  offset?: number;
}

@Processor('lessons-queue')
export class LessonsProcessor {
  constructor(
    private readonly untisService: UntisService,
    private readonly lessonsService: LessonsService,
  ) {}

  @Process('fetch')
  async handleFetch(job: Job<FetchData>) {
    const { before, after, classId } = job.data;
    const lessons = await this.untisService.fetchTimetable(
      before,
      after,
      classId,
    );
    await job.progress(100);
    return lessons;
  }

  @Process('fetch-ics')
  async handleFetchIcs(job: Job<FetchIcsData>) {
    const {
      before,
      after,
      classId,
      includedSubjects,
      excludedSubjects,
      alarms,
      offset,
    } = job.data;
    const lessons = await this.untisService.fetchTimetable(
      before,
      after,
      classId,
    );
    await job.progress(50);
    const ics = await this.lessonsService.convertToEvents(lessons, {
      includedSubjects,
      excludedSubjects,
      alarms,
      offset,
    });
    await job.progress(100);
    return ics;
  }
}
