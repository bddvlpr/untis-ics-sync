import { Module } from '@nestjs/common';
import { UntisModule } from 'src/untis/untis.module';
import { HolidaysController } from './holidays.controller';
import { HolidaysService } from './holidays.service';

@Module({
  controllers: [HolidaysController],
  imports: [UntisModule],
  providers: [HolidaysService],
})
export class HolidaysModule {}
