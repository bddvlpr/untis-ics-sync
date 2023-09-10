import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Metadata {
  @ApiProperty({ description: "The metadata's identification number." })
  id: number;

  @ApiProperty({ description: "The metadata's name value." })
  name: string;

  @ApiProperty({ description: "The metadata's long name value." })
  longname: string;
}

export class GetLessonDto {
  @ApiProperty({ description: "The lesson's identification number." })
  id: number;

  @ApiProperty({
    description:
      "The lesson's set date. Use this in combination with *startTime* and *endTime*.",
  })
  date: Date;

  @ApiProperty({
    description: "The lesson's starting time in WebUntis formatting.",
  })
  startTime: number;

  @ApiProperty({
    description: "The lesson's ending time in WebUntis formatting.",
  })
  endTime: number;

  @ApiProperty({
    description: "The lesson's attending classes.",
    type: [Metadata],
  })
  kl: Metadata[];

  @ApiProperty({ description: "The lesson's teachers.", type: [Metadata] })
  te: Metadata[];

  @ApiProperty({ description: "The lesson's subjects.", type: [Metadata] })
  su: Metadata[];

  @ApiProperty({ description: "The lesson's rooms.", type: [Metadata] })
  ro: Metadata[];

  @ApiPropertyOptional({ description: "The lesson's optional meta text." })
  lstext?: string;

  @ApiProperty({
    description:
      "The lesson's shared identification number. Used for repeating classes.",
  })
  lsnumber: number;

  @ApiPropertyOptional({ description: "The lesson's type." })
  activityType?: string;

  @ApiPropertyOptional({ description: "The lesson's state." })
  code?: 'cancelled' | 'irregular';

  @ApiPropertyOptional({ description: "The lesson's optional information." })
  info?: string;
}
