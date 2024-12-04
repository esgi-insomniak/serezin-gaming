import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from 'src/services/pagination.service';
import { Tournament } from './entities/tournament.entity';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament])],
  exports: [TypeOrmModule],
  controllers: [TournamentController],
  providers: [TournamentService, PaginationService],
})
export class TournamentModule {}
