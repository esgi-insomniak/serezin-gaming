import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Member } from '../member/entities/member.entity';
import { Tournament } from './entities/tournament.entity';
import { TournamentService } from './tournament.service';

@Controller('tournament')
@ApiTags('Tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  findAll() {
    return this.tournamentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentService.findOne(id);
  }

  @Post()
  create() {
    // By default, owner is also a member of the tournament
    const owner = new Member();
    const tournament = new Tournament();
    tournament.owner = owner;
    tournament.members = [owner];
    return this.tournamentService.create(tournament);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentService.remove(id);
  }
}
