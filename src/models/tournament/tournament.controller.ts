import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('tournament')
@ApiTags('Tournament')
export class TournamentController {}
