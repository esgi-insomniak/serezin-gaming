import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  DefaultResponse,
  GetResponseArray,
  GetResponseOne,
} from 'src/common/interfaces/response.interface';
import { GetItemByIdDto } from 'src/common/validators/params.dto';
import { GetItemsPaginationDto } from 'src/common/validators/query.dto';
import { Member } from '../member/entities/member.entity';
import { MemberRoles } from '../member/enum/roles.enum';
import { Tournament } from './entities/tournament.entity';
import { TournamentService } from './tournament.service';
import {
  TournamentResponseDto,
  TournamentsResponseDto,
} from './validators/tournament.response.dto';

@Controller('tournament')
@ApiTags('Tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  @ApiOkResponse({ type: TournamentsResponseDto })
  async findAll(
    @Query() query: GetItemsPaginationDto,
  ): Promise<GetResponseArray<Tournament>> {
    const response: GetResponseArray<Tournament> = {
      items: [],
      status: HttpStatus.OK,
    };

    try {
      response.items = await this.tournamentService.findAll(query);
    } catch {
      response.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return response;
  }

  @Get(':id')
  @ApiOkResponse({ type: TournamentResponseDto })
  async findOne(
    @Param() params: GetItemByIdDto,
  ): Promise<GetResponseOne<Tournament>> {
    const response: GetResponseOne<Tournament> = {
      item: null,
      status: HttpStatus.OK,
    };

    try {
      response.item = await this.tournamentService.findOne(params);
      if (!response.item) response.status = HttpStatus.NOT_FOUND;
    } catch {
      response.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return response;
  }

  @Post()
  @ApiCreatedResponse({ type: TournamentResponseDto })
  async create(): Promise<GetResponseOne<Tournament>> {
    // By default, owner is also a member of the tournament
    const owner = new Member();
    owner.role = MemberRoles.OWNER;
    const tournament = new Tournament();
    tournament.owner = owner;
    tournament.members = [owner];

    const response: GetResponseOne<Tournament> = {
      item: null,
      status: HttpStatus.CREATED,
    };

    try {
      response.item = await this.tournamentService.create(tournament);
    } catch {
      response.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return response;
  }

  @Delete(':id')
  @ApiNoContentResponse()
  async remove(
    @Param() params: GetItemByIdDto,
  ): Promise<void | DefaultResponse> {
    const errorResponse: DefaultResponse = {
      status: HttpStatus.FORBIDDEN,
    };

    try {
      const foundTournament = await this.tournamentService.findOne(params);
      if (!foundTournament) return errorResponse;
      await this.tournamentService.remove(params);
    } catch {
      errorResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
      return errorResponse;
    }
  }
}
