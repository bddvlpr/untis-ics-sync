import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { UntisService } from './untis.service';

@Module({
  providers: [UntisService],
  imports: [CacheModule.register()],
  exports: [UntisService],
})
export class UntisModule {}
