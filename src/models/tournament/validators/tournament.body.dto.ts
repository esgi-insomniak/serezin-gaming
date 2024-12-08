import { IsString, MaxLength } from 'class-validator';

export class TournamentBodyCreateDto {
  @IsString()
  @MaxLength(255)
  name: string;
}
