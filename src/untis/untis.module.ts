import { Module } from '@nestjs/common';
import { UntisService } from './untis.service';

@Module({
  providers: [UntisService],
  exports: [UntisService],
})
export class UntisModule {}
