import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParamGetItemById } from 'src/common/interfaces/params.interface';
import { QueryGetItems } from 'src/common/interfaces/query.interface';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}

  async findAll(query: QueryGetItems): Promise<Tournament[]> {
    return this.tournamentRepository.find({
      take: query.limit || 10,
      skip: query.offset * query.limit || 0,
      relations: ['members', 'owner'],
    });
  }

  async findOne(params: ParamGetItemById): Promise<Tournament | null> {
    return this.tournamentRepository.findOne({
      where: { id: params.id },
      relations: ['members', 'owner'],
    });
  }

  async create(tournament: Tournament): Promise<Tournament> {
    return this.tournamentRepository.save(tournament);
  }

  async update(tournament: Tournament): Promise<Tournament> {
    return this.tournamentRepository.save({ ...tournament });
  }

  async remove(params: ParamGetItemById): Promise<void> {
    await this.tournamentRepository.delete({ id: params.id });
  }
}
