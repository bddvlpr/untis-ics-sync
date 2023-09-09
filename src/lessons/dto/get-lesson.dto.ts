import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Metadata {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  longname: string;
}

export class GetLessonDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  startTime: number;

  @ApiProperty()
  endTime: number;

  @ApiProperty({ type: [Metadata] })
  kl: Metadata[];

  @ApiProperty({ type: [Metadata] })
  te: Metadata[];

  @ApiProperty({ type: [Metadata] })
  su: Metadata[];

  @ApiProperty({ type: [Metadata] })
  ro: Metadata[];

  @ApiPropertyOptional()
  lstext?: string;

  @ApiProperty()
  lsnumber: number;

  @ApiPropertyOptional()
  activityType?: string;

  @ApiPropertyOptional()
  code?: 'cancelled' | 'irregular';

  @ApiPropertyOptional()
  info?: string;

  @ApiPropertyOptional()
  substText?: string;

  @ApiPropertyOptional()
  statflags?: string;

  @ApiPropertyOptional()
  sg?: string;

  @ApiPropertyOptional()
  bkRemark?: string;

  @ApiPropertyOptional()
  bkText?: string;
}
