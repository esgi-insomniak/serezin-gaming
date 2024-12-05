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
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { ControllerResponseData } from 'src/common/interfaces/response.interface';
import { ParamGetItemByIdDto } from 'src/common/validators/params.dto';
import { QueryPaginationDto } from 'src/common/validators/query.dto';
import { InternalServerErrorResponseDto } from 'src/common/validators/response.dto';
import { DeleteResult } from 'typeorm';
import { Member } from '../member/entities/member.entity';
import { MemberRoles } from '../member/enum/roles.enum';
import { TournamentResponseMessageEnum } from './constants/tournament.response.constant';
import { Tournament } from './entities/tournament.entity';
import { TournamentService } from './tournament.service';
import {
  TournamentArrayOkResponseDto,
  TournamentBadRequestResponseDto,
  TournamentCreatedResponseDto,
  TournamentNotFoundResponseDto,
  TournamentOKResponseDto,
} from './validators/tournament.response.dto';

@Controller('tournament')
@ApiTags('Tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  @ApiOkResponse({ type: TournamentArrayOkResponseDto })
  @ApiBadRequestResponse({ type: TournamentBadRequestResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @Pagination({
    itemsPerPage: 10,
    maxItemsPerPage: 50,
  })
  @ResponseMessage([
    { status: HttpStatus.OK, message: TournamentResponseMessageEnum.OK },
  ])
  @ApiOperation({
    operationId: 'tournamentFindAll',
  })
  async findAll(
    @Query() query: QueryPaginationDto,
  ): Promise<ControllerResponseData<Tournament[]>> {
    return await this.tournamentService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: TournamentOKResponseDto })
  @ApiNotFoundResponse({ type: TournamentNotFoundResponseDto })
  @ApiBadRequestResponse({ type: TournamentBadRequestResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @ResponseMessage([
    { status: HttpStatus.OK, message: TournamentResponseMessageEnum.OK },
    {
      status: HttpStatus.NOT_FOUND,
      message: TournamentResponseMessageEnum.NOT_FOUND,
    },
  ])
  @ApiOperation({
    operationId: 'tournamentFindOne',
  })
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
  @ApiCreatedResponse({ type: TournamentCreatedResponseDto })
  @ApiBadRequestResponse({ type: TournamentBadRequestResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @ResponseMessage([
    {
      status: HttpStatus.CREATED,
      message: TournamentResponseMessageEnum.CREATED,
    },
  ])
  @ApiOperation({
    operationId: 'tournamentCreate',
  })
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
  @ApiNotFoundResponse({ type: TournamentNotFoundResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @ResponseMessage([
    {
      status: HttpStatus.NOT_FOUND,
      message: TournamentResponseMessageEnum.NOT_FOUND,
    },
  ])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    operationId: 'tournamentRemove',
  })
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
