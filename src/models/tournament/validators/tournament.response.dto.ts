import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ResponsePaginationMetaDto } from 'src/common/validators/metadata.dto';
import { withBaseResponse } from 'src/common/validators/response.dto';

const TournamentExample = {
  id: '51d0af06-f14b-4932-bba8-697201468cda',
  owner: '60f51f4e-4e15-4c2b-9ba9-7675c850d81a',
  members: ['60f51f4e-4e15-4c2b-9ba9-7675c850d81a'],
};

export class TournamentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  owner: string;

  @ApiProperty()
  members: string[];
}

export class TournamentArrayResponseDto extends OmitType(
  withBaseResponse(TournamentDto, {
    isArray: true,
    example: [TournamentExample],
  }),
  ['meta'],
) {
  @ApiProperty()
  meta: ResponsePaginationMetaDto;
}

export class TournamentResponseDto extends withBaseResponse(TournamentDto, {
  example: TournamentExample,
}) {}
