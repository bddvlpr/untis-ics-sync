import { Injectable, Logger } from '@nestjs/common';
import { createEvents, EventAttributes } from 'ics';
import { Lesson, WebUntis } from 'webuntis';

export interface LessonsOptions {
  includedSubjects?: number[];
  excludedSubjects?: number[];
}

@Injectable()
export class LessonsService {
  private readonly logger: Logger = new Logger(LessonsService.name);

  convertDate(date: Date) {
    return [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    ];
  }

  async convertToEvents(
    lessons: Lesson[],
    { includedSubjects, excludedSubjects }: LessonsOptions,
  ) {
    const events = createEvents(
      lessons
        .reduce((acc, curr) => {
          const last = acc[acc.length - 1];
          if (last && last.lsnumber === curr.lsnumber) {
            last.endTime = curr.endTime;
            return acc;
          }
          return [...acc, curr];
        }, [] as Lesson[])
        .filter((l) =>
          includedSubjects
            ? l.su.find((s) => includedSubjects.includes(s.id))
            : excludedSubjects
            ? !l.su.find((s) => excludedSubjects.includes(s.id))
            : true,
        )
        .map((l) => ({
          ...l,
          date: WebUntis.convertUntisDate(l.date.toString()),
        }))
        .map((l) => ({
          ...l,
          start: WebUntis.convertUntisTime(l.startTime, l.date),
          end: WebUntis.convertUntisTime(l.endTime, l.date),
        }))
        .map(
          (l) =>
            ({
              title: l.su.map((s) => s.longname).join(','),

              start: this.convertDate(l.start),
              startInputType: 'local',
              startOutputType: 'local',

              end: this.convertDate(l.end),
              endInputType: 'local',
              endOutputType: 'local',
            } as EventAttributes),
        ),
    );

    if (events.error) {
      this.logger.error(`Failed creating events: ${events.error}.`);
      return null;
    }

    return events.value;
  }
}
