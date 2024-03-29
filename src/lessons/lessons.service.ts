import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createEvents, EventAttributes } from 'ics';
import { Lesson, WebUntis } from 'webuntis';

export interface LessonsOptions {
  includedSubjects?: number[];
  excludedSubjects?: number[];
  alarms?: number[];
  offset?: number;
}

@Injectable()
export class LessonsService {
  private readonly logger: Logger = new Logger(LessonsService.name);

  constructor(private readonly configService: ConfigService) {}

  convertDate(date: Date, offset = 0) {
    return [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours() + offset,
      date.getMinutes(),
    ];
  }

  async convertToEvents(
    lessons: Lesson[],
    { includedSubjects, excludedSubjects, alarms, offset }: LessonsOptions,
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
                ? `${l.su.map((s) => s.longname).join(', ')} (${l.lstext})`
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

              start: this.convertDate(l.start, offset),
              startInputType: 'local',
              startOutputType: 'utc',

              end: this.convertDate(l.end, offset),
              endInputType: 'local',
              endOutputType: 'utc',
            } as EventAttributes),
        )
        .concat([this.createMaintenanceEvent()])
        .filter((e) => e),
    );

    if (error) {
      this.logger.error(`Failed creating events: ${error.message}.`);
      return null;
    }

    return value;
  }

  createMaintenanceEvent() {
    const title = this.configService.get<string>(
        'MAINTENANCE_TITLE',
        undefined,
      ),
      description = this.configService.get<string>(
        'MAINTENANCE_DESCRIPTION',
        undefined,
      ),
      location = this.configService.get<string>(
        'MAINTENANCE_LOCATION',
        undefined,
      );
    const today = new Date();
    return title
      ? ({
          title: title ?? 'Maintenance',
          description,
          location,

          start: [today.getFullYear(), today.getMonth() + 1, today.getDate()],
          startInputType: 'local',
          startOutputType: 'utc',

          end: [today.getFullYear(), today.getMonth() + 1, today.getDate()],
          endInputType: 'local',
          endOutputType: 'utc',
        } as EventAttributes)
      : undefined;
  }
}
