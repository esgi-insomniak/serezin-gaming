import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}

  async findAll(): Promise<Tournament[]> {
    return this.tournamentRepository.find();
  }

  async findOne(id: string): Promise<Tournament | null> {
    return this.tournamentRepository.findOne({
      where: { id },
      relations: ['members', 'owner'],
    });
  }

  async create(tournament: Tournament): Promise<Tournament> {
    return this.tournamentRepository.save(tournament);
  }

  async update(tournament: Tournament): Promise<Tournament> {
    return this.tournamentRepository.save({ ...tournament });
  }

  async remove(id: string): Promise<void> {
    await this.tournamentRepository.delete(id);
  }
}
