import {
  Body,
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
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Authorization } from 'src/common/decorators/authorization.decorator';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { ControllerResponseData } from 'src/common/interfaces/response.interface';
import { ParamGetItemByIdDto } from 'src/common/validators/params.dto';
import { QueryPaginationDto } from 'src/common/validators/query.dto';
import {
  ForbiddenResponseDto,
  InternalServerErrorResponseDto,
} from 'src/common/validators/response.dto';
import { DeleteResult } from 'typeorm';
import { Member } from '../member/entities/member.entity';
import { MemberRolesEnum } from '../member/enum/roles.enum';
import { Tournament } from './entities/tournament.entity';
import { TournamentResponseMessageEnum } from './enum/tournament.response.enum';
import { TournamentService } from './tournament.service';
import { TournamentBodyCreateDto } from './validators/tournament.body.dto';
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
    {
      status: HttpStatus.OK,
      message: TournamentResponseMessageEnum.OK.FIND_ALL,
    },
  ])
  @ApiOperation({
    operationId: 'tournamentGetAll',
  })
  async getAll(
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
    {
      status: HttpStatus.OK,
      message: TournamentResponseMessageEnum.OK.FIND_ONE,
    },
    {
      status: HttpStatus.NOT_FOUND,
      message: TournamentResponseMessageEnum.NOT_FOUND.DEFAULT,
    },
  ])
  @ApiOperation({
    operationId: 'tournamentGetOneById',
  })
  async getOneById(
    @Param() params: ParamGetItemByIdDto,
  ): Promise<ControllerResponseData<Tournament>> {
    const tournament = await this.tournamentService.findOne(params);
    if (!tournament) throw new NotFoundException();
    return {
      result: tournament,
    };
  }

  @Post()
  @Authorization({ secured: true })
  @ApiCreatedResponse({ type: TournamentCreatedResponseDto })
  @ApiForbiddenResponse({ type: ForbiddenResponseDto })
  @ApiBadRequestResponse({ type: TournamentBadRequestResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @ResponseMessage([
    {
      status: HttpStatus.CREATED,
      message: TournamentResponseMessageEnum.CREATED.DEFAULT,
    },
  ])
  @ApiOperation({
    operationId: 'tournamentCreate',
  })
  async create(
    @Body() body: TournamentBodyCreateDto,
  ): Promise<ControllerResponseData<Tournament>> {
    // By default, owner is also a member of the tournament
    const owner = new Member();
    owner.role = MemberRolesEnum.OWNER;
    const tournament = new Tournament();
    tournament.owner = owner;
    tournament.members = [owner];
    tournament.name = body.name;

    return {
      result: await this.tournamentService.create(tournament),
    };
  }

  @Delete(':id')
  @Authorization({ secured: true })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ type: TournamentNotFoundResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @ResponseMessage([
    {
      status: HttpStatus.NOT_FOUND,
      message: TournamentResponseMessageEnum.NOT_FOUND.DEFAULT,
    },
  ])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    operationId: 'tournamentRemoveById',
  })
  async removeById(
    @Param() params: ParamGetItemByIdDto,
  ): Promise<ControllerResponseData<DeleteResult>> {
    const tournament = await this.tournamentService.findOne(params);
    if (!tournament) throw new NotFoundException();
    return {
      result: await this.tournamentService.remove(params),
    };
  }
}
