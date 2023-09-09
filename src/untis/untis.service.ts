import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { Lesson, WebUntis } from 'webuntis';

@Injectable()
export class UntisService {
  private readonly logger = new Logger(UntisService.name);

  client: WebUntis;

  constructor(readonly configService: ConfigService) {
    this.client = new WebUntis(
      configService.get('UNTIS_SCHOOLNAME'),
      configService.get('UNTIS_USERNAME'),
      configService.get('UNTIS_PASSWORD'),
      configService.get('UNTIS_BASEURL'),
    );
  }

  async validateSession() {
    if (!(await this.client.validateSession())) {
      this.logger.debug('Session is invalid. Renewing now...');
      await this.client.login();
    }
  }

  async fetchLatestSchoolyear() {
    await this.validateSession();

    this.logger.log('Fetching latest schoolyear...');
    return this.client.getLatestSchoolyear(false);
  }

  async fetchClasses(schoolyearId?: number) {
    await this.validateSession();

    if (!schoolyearId) schoolyearId = (await this.fetchLatestSchoolyear()).id;
    this.logger.log(`Fetching classes for schoolyear ${schoolyearId}...`);
    return this.client.getClasses(false, schoolyearId);
  }

  async fetchSubjects() {
    await this.validateSession();

    this.logger.log('Fetching subjects...');
    return this.client.getSubjects(false);
  }

  async fetchTimetable(
    before: number,
    after: number,
    classId: number,
  ): Promise<Lesson[]> {
    await this.validateSession();

    const currentMoment = moment().subtract(before, 'days');
    const endMoment = moment().add(after, 'days');

    let lessonsRange = await this.fetchTimetableRange(
      moment().subtract(before, 'days').toDate(),
      moment().add(after, 'days').toDate(),
      classId,
    ).catch(() => null);

    if (!lessonsRange) {
      this.logger.warn(
        'Range fetch failed, falling back on individual date fetch.',
      );
      const promises = [];
      while (currentMoment.isBefore(endMoment)) {
        promises.push(
          this.fetchTimetableFor(currentMoment.toDate(), classId).catch(() =>
            this.logger.debug(
              `No data found for day ${currentMoment
                .toDate()
                .toLocaleDateString()}.`,
            ),
          ),
        );
        currentMoment.add(1, 'days');
      }
      lessonsRange = (await Promise.all(promises)).filter((l) => l).flat();
    }
    return lessonsRange;
  }

  private fetchTimetableRange(
    start: Date,
    end: Date,
    classId: number,
    type = 1,
  ) {
    this.logger.log(
      `Fetching timetable range ${start.toLocaleDateString()} to ${end.toLocaleDateString()}...`,
    );
    return this.client.getTimetableForRange(start, end, classId, type);
  }

  private fetchTimetableFor(date: Date, classId: number, type = 1) {
    this.logger.log(`Fetching timetable for ${date.toLocaleDateString()}...`);
    return this.client.getTimetableFor(date, classId, type);
  }
}
