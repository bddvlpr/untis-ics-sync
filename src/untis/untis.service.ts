import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import * as moment from 'moment';
import {
  Holiday,
  Klasse,
  Lesson,
  SchoolYear,
  Subject,
  WebUntis,
} from 'webuntis';

const CACHE_SCHOOLYEAR = 'SCHOOLYEAR',
  CACHE_CLASSES = 'CLASSES',
  CACHE_SUBJECTS = 'SUBJECTS',
  CACHE_TIMETABLE = 'TIMETABLE',
  CACHE_HOLIDAYS = 'HOLIDAYS';

@Injectable()
export class UntisService {
  private readonly logger = new Logger(UntisService.name);

  client: WebUntis;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    readonly configService: ConfigService,
  ) {
    this.client = new WebUntis(
      configService.get('UNTIS_SCHOOLNAME'),
      configService.get('UNTIS_USERNAME'),
      configService.get('UNTIS_PASSWORD'),
      configService.get('UNTIS_BASEURL'),
    );
  }

  async retrieveCache<Type>(
    key: string,
    fetch: () => Promise<Type>,
    ttl = 15000,
  ): Promise<Type> {
    const oldData = await this.cacheManager.get<Type>(key);

    if (oldData) {
      this.logger.debug(`Cache for ${key} exists.`);
      return oldData;
    } else {
      this.logger.debug(`No cache for ${key} exists.`);
      const newData = await fetch();
      this.cacheManager.set(key, newData, ttl);
      return newData;
    }
  }

  async validateSession() {
    if (!(await this.client.validateSession())) {
      this.logger.debug('Session is invalid. Renewing now...');
      await this.client.login();
    }
  }

  async fetchLatestSchoolyear() {
    return await this.retrieveCache<SchoolYear>(CACHE_SCHOOLYEAR, async () => {
      await this.validateSession();

      this.logger.log('Fetching latest schoolyear...');
      return this.client.getLatestSchoolyear(false);
    });
  }

  async fetchClasses(schoolyearId?: number) {
    return await this.retrieveCache<Klasse[]>(CACHE_CLASSES, async () => {
      await this.validateSession();

      if (!schoolyearId) schoolyearId = (await this.fetchLatestSchoolyear()).id;
      this.logger.log(`Fetching classes for schoolyear ${schoolyearId}...`);
      return this.client.getClasses(false, schoolyearId);
    });
  }

  async fetchSubjects() {
    return await this.retrieveCache<Subject[]>(CACHE_SUBJECTS, async () => {
      await this.validateSession();

      this.logger.log('Fetching subjects...');
      return this.client.getSubjects(false);
    });
  }

  async fetchHolidays() {
    return await this.retrieveCache<Holiday[]>(CACHE_HOLIDAYS, async () => {
      await this.validateSession();

      this.logger.log('Fetching holidays...');
      return this.client.getHolidays(false);
    });
  }

  async fetchTimetable(
    before: number,
    after: number,
    classId: number,
  ): Promise<Lesson[]> {
    return await this.retrieveCache<Lesson[]>(
      `${CACHE_TIMETABLE}.${classId}`,
      async () => {
        await this.validateSession();

        const currentMoment = moment().subtract(before, 'days');
        const endMoment = moment().add(after, 'days');

        let lessonsRange = await this.fetchTimetableRange(
          currentMoment.toDate(),
          endMoment.toDate(),
          classId,
        ).catch(() => null);

        if (!lessonsRange) {
          this.logger.warn(
            'Range fetch failed, falling back on individual date fetch.',
          );
          const promises = [];
          while (currentMoment.isBefore(endMoment)) {
            promises.push(
              this.fetchTimetableFor(currentMoment.toDate(), classId),
            );
            currentMoment.add(1, 'days');
          }
          lessonsRange = (await Promise.all(promises)).filter((l) => l).flat();
        }
        return lessonsRange;
      },
      60_000,
    );
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
    return this.client
      .getTimetableFor(date, classId, type)
      .catch((e) =>
        this.logger.debug(
          `No data found for ${date.toLocaleDateString()}. ${e}`,
        ),
      );
  }
}
