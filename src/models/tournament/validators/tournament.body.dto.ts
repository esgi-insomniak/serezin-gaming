import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { TournamentExample } from './tournament.response.dto';

export class TournamentBodyCreateDto {
  @ApiProperty({ required: true, default: TournamentExample.name })
  @IsString()
  @MaxLength(255)
  name: string;
}
