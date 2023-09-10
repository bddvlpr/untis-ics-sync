import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetSubjectDto {
  @ApiProperty({ description: "The subject's identification number." })
  id: number;

  @ApiProperty({ description: "The subject's short name." })
  name: string;

  @ApiProperty({ description: "The subject's longer, more descriptive, name." })
  longName: string;

  @ApiProperty({ description: "The subject's current state." })
  active: boolean;

  @ApiPropertyOptional({
    description: "The subject's optional alternative name.",
  })
  alternateName?: string;

  @ApiPropertyOptional({
    description: 'Optional forced foreground color representing the subject.',
  })
  foreColor?: string;

  @ApiPropertyOptional({
    description: 'Optional forced background color representing the subject.',
  })
  backColor?: string;
}
