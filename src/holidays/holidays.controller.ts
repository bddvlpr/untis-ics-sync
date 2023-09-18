import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UntisService } from 'src/untis/untis.service';
import { HolidaysService } from './holidays.service';

@ApiTags('holidays')
@Controller('holidays')
export class HolidaysController {
  constructor(
    private readonly untisService: UntisService,
    private readonly holidaysService: HolidaysService,
  ) {}

  @Header('Content-Type', 'text/calendar')
  @Get()
  async getHolidays() {
    const holidays = await this.untisService.fetchHolidays();
    return await this.holidaysService.convertToEvents(holidays);
  }
}
