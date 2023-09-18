import { Injectable, Logger } from '@nestjs/common';
import { createEvents, EventAttributes } from 'ics';
import { Lesson, WebUntis } from 'webuntis';

export interface LessonsOptions {
  includedSubjects?: number[];
  excludedSubjects?: number[];
  alarms: number[];
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
    { includedSubjects, excludedSubjects, alarms }: LessonsOptions,
  ) {
    const { error, value } = createEvents(
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
              uid: l.id.toString(),
              title: l.lstext
                ? `${l.lstext} (${l.su.map((s) => s.longname).join(', ')})`
                : l.su.map((s) => s.longname).join(', '),

              description: `Teacher(s): ${l.te
                .map((t) => t.longname)
                .join(', ')}\nSubject(s): ${l.su.map(
                (s) => `${s.longname} (${s.id})`,
              )}\nClass(es): ${l.kl.map((k) => k.longname).join(', ')}`,
              location: l.ro.map((r) => r.longname).join('\n'),

              alarms: alarms?.map((minutes) => ({
                trigger: {
                  minutes,
                  before: true,
                },
                action: 'display',
              })),

              start: this.convertDate(l.start),
              startInputType: 'local',
              startOutputType: 'utc',

              end: this.convertDate(l.end),
              endInputType: 'local',
              endOutputType: 'utc',
            } as EventAttributes),
        ),
    );

    if (error) {
      this.logger.error(`Failed creating events: ${error.message}.`);
      return null;
    }

    return value;
  }
}
