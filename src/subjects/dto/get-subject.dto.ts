import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetSubjectDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  longName: string;

  @ApiProperty()
  active: boolean;

  @ApiPropertyOptional()
  alternateName?: string;

  @ApiPropertyOptional()
  foreColor?: string;

  @ApiPropertyOptional()
  backColor?: string;
}
