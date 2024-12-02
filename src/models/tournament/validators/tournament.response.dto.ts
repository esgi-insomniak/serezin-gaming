import { ApiProperty } from '@nestjs/swagger';
import { DefaultResponseDto } from 'src/common/validators/response.dto';
import { Tournament } from '../entities/tournament.entity';

const TournamentExample = {
  owner: {
    role: 'owner',
    id: '60f51f4e-4e15-4c2b-9ba9-7675c850d81a',
  },
  members: [
    {
      role: 'owner',
      id: '60f51f4e-4e15-4c2b-9ba9-7675c850d81a',
    },
  ],
  id: '51d0af06-f14b-4932-bba8-697201468cda',
};

export class TournamentsResponseDto extends DefaultResponseDto {
  @ApiProperty({
    example: [TournamentExample],
  })
  items: Tournament[];
}

export class TournamentResponseDto extends DefaultResponseDto {
  @ApiProperty({
    example: TournamentExample,
  })
  item: Tournament;
}
