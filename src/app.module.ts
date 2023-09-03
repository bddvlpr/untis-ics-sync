import { Module } from '@nestjs/common';
import { UntisModule } from './untis/untis.module';
import { ClassesModule } from './classes/classes.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    UntisModule,
    ClassesModule,
  ],
})
export class AppModule {}
