import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
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
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { ControllerResponseData } from 'src/common/interceptors/response-formater.interceptor';
import { ParamGetItemByIdDto } from 'src/common/validators/params.dto';
import { QueryPaginationDto } from 'src/common/validators/query.dto';
import { DeleteResult } from 'typeorm';
import { Member } from '../member/entities/member.entity';
import { MemberRoles } from '../member/enum/roles.enum';
import { Tournament } from './entities/tournament.entity';
import { TournamentService } from './tournament.service';
import {
  TournamentArrayResponseDto,
  TournamentResponseDto,
} from './validators/tournament.response.dto';

@Controller('tournament')
@ApiTags('Tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  @ApiOkResponse({ type: TournamentArrayResponseDto })
  @Pagination({
    itemsPerPage: 10,
    maxItemsPerPage: 50,
  })
  @ResponseMessage([
    { status: HttpStatus.OK, message: 'Sucessfully fetched Tournaments' },
  ])
  async findAll(
    @Query() query: QueryPaginationDto,
  ): Promise<ControllerResponseData<Tournament[]>> {
    return await this.tournamentService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: TournamentResponseDto })
  @ResponseMessage([
    { status: HttpStatus.OK, message: 'Sucessfully fetched Tournament' },
    { status: HttpStatus.NOT_FOUND, message: 'Tournament not found' },
  ])
  async findOne(
    @Param() params: ParamGetItemByIdDto,
  ): Promise<ControllerResponseData<Tournament>> {
    const tournament = await this.tournamentService.findOne(params);
    if (!tournament) throw new NotFoundException();
    return {
      result: tournament,
    };
  }

  @Post()
  @ApiCreatedResponse({ type: TournamentResponseDto })
  @ResponseMessage([
    { status: HttpStatus.CREATED, message: 'Sucessfully created Tournament' },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to create Tournament',
    },
  ])
  async create(): Promise<ControllerResponseData<Tournament>> {
    // By default, owner is also a member of the tournament
    const owner = new Member();
    owner.role = MemberRoles.OWNER;
    const tournament = new Tournament();
    tournament.owner = owner;
    tournament.members = [owner];

    return {
      result: await this.tournamentService.create(tournament),
    };
  }

  @Delete(':id')
  @ApiNoContentResponse()
  @ResponseMessage([
    { status: HttpStatus.NOT_FOUND, message: 'Tournament not found' },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete Tournament',
    },
  ])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param() params: ParamGetItemByIdDto,
  ): Promise<ControllerResponseData<DeleteResult>> {
    const tournament = await this.tournamentService.findOne(params);
    if (!tournament) throw new NotFoundException();
    return {
      result: await this.tournamentService.remove(params),
    };
  }
}
