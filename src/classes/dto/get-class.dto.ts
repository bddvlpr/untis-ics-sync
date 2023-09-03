import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetClassDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  longName: string;

  @ApiProperty()
  did: number;

  @ApiPropertyOptional()
  foreColor: string;

  @ApiPropertyOptional()
  backColor: string;
}
