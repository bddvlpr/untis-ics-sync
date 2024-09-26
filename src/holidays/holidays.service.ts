import { Injectable, Logger } from '@nestjs/common';
import { createEvents, EventAttributes } from 'ics';
import { Holiday, WebUntis } from 'webuntis';

@Injectable()
export class HolidaysService {
  private readonly logger: Logger = new Logger(HolidaysService.name);

  async convertToEvents(holidays: Holiday[]) {
    const { error, value } = createEvents(
      holidays
        .map((h) => ({
          ...h,
          start: WebUntis.convertUntisDate(h.startDate.toString()),
          end: WebUntis.convertUntisDate(h.endDate.toString()),
        }))
        .map(
          (h) =>
            ({
              title: h.name,
              description: h.longName,

              start: [
                h.start.getFullYear(),
                h.start.getMonth() + 1,
                h.start.getDate(),
              ],
              startInputType: 'local',
              startOutputType: 'utc',

              end: [h.end.getFullYear(), h.end.getMonth() + 1, h.end.getDate()],
              endInputType: 'local',
              endOutputType: 'utc',
            }) as EventAttributes,
        ),
    );

    if (error) {
      this.logger.error(`Failed creating events: ${error.message}.`);
      return null;
    }

    return value;
  }
}
