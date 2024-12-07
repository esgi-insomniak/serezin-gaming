import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParamGetItemById } from 'src/common/interfaces/params.interface';
import { QueryPagination } from 'src/common/interfaces/query.interface';
import {
  PaginateResponse,
  PaginationService,
} from 'src/common/services/pagination.service';
import { DeleteResult, Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    private readonly paginationService: PaginationService,
  ) {}

  async findAll(query: QueryPagination): Promise<PaginateResponse<Tournament>> {
    return await this.paginationService.paginate(
      this.tournamentRepository,
      query,
    );
  }

  async findOne(params: ParamGetItemById): Promise<Tournament | null> {
    return await this.tournamentRepository.findOne({
      where: { id: params.id },
      loadRelationIds: true,
    });
  }

  async create(tournament: Tournament): Promise<Tournament> {
    await this.tournamentRepository.save(tournament);
    return this.findOne({ id: tournament.id });
  }

  async update(tournament: Tournament): Promise<Tournament> {
    await this.tournamentRepository.save({ ...tournament });
    return this.findOne({ id: tournament.id });
  }

  async remove(params: ParamGetItemById): Promise<DeleteResult> {
    return await this.tournamentRepository.delete({ id: params.id });
  }
}
