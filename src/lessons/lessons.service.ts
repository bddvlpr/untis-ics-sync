import { Injectable } from '@nestjs/common';
import { UntisService } from 'src/untis/untis.service';

export interface LessonsOptions {
  excludedClasses?: number[];
  includedClasses?: number[];
}

@Injectable()
export class LessonsService {
  constructor(private readonly untisService: UntisService) {}

  async getLessons(classId: number, options?: LessonsOptions) {
    const lessons = await this.untisService.fetchTimetable(14, 31, classId);

    return lessons;
  }
}
