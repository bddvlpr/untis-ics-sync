import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetClassDto {
  @ApiProperty({ description: "The class's identification number." })
  id: number;

  @ApiProperty({ description: "The class's short name." })
  name: string;

  @ApiProperty({ description: "The class's longer, more descriptive, name." })
  longName: string;

  @ApiProperty({ description: "The class's department identification number." })
  did: number;

  @ApiPropertyOptional({
    description: 'Optional forced foreground color representing the class.',
  })
  foreColor?: string;

  @ApiPropertyOptional({
    description: 'Optional forced background color representing the class.',
  })
  backColor?: string;
}
