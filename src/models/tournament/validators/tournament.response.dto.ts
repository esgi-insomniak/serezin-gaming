import { HttpStatus } from '@nestjs/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ResponsePaginationMetaDto } from 'src/common/validators/metadata.dto';
import {
  withBaseErrorResponse,
  withBaseResponse,
} from 'src/common/validators/response.dto';
import { TournamentResponseMessageEnum } from '../enum/tournament.response.enum';

const TournamentExample = {
  id: '51d0af06-f14b-4932-bba8-697201468cda',
  owner: '60f51f4e-4e15-4c2b-9ba9-7675c850d81a',
  members: ['60f51f4e-4e15-4c2b-9ba9-7675c850d81a'],
  isArchived: false,
};

export class TournamentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  owner: string;

  @ApiProperty()
  members: string[];

  @ApiProperty()
  isArchived: boolean;
}

export class TournamentArrayOkResponseDto extends OmitType(
  withBaseResponse(
    TournamentDto,
    {
      statusCode: HttpStatus.OK,
      message: TournamentResponseMessageEnum.OK.FIND_ALL,
    },
    {
      isArray: true,
      example: [TournamentExample],
    },
  ),
  ['meta'],
) {
  @ApiProperty()
  meta: ResponsePaginationMetaDto;
}

export class TournamentOKResponseDto extends withBaseResponse(
  TournamentDto,
  {
    statusCode: HttpStatus.OK,
    message: TournamentResponseMessageEnum.OK.FIND_ONE,
  },
  {
    example: TournamentExample,
  },
) {}

export class TournamentCreatedResponseDto extends withBaseResponse(
  TournamentDto,
  {
    statusCode: HttpStatus.CREATED,
    message: TournamentResponseMessageEnum.CREATED.DEFAULT,
  },
  {
    example: TournamentExample,
  },
) {}

export class TournamentNotFoundResponseDto extends withBaseErrorResponse({
  statusCode: HttpStatus.NOT_FOUND,
  message: TournamentResponseMessageEnum.NOT_FOUND.DEFAULT,
}) {}

export class TournamentBadRequestResponseDto extends withBaseErrorResponse({
  statusCode: HttpStatus.BAD_REQUEST,
  message: TournamentResponseMessageEnum.BAD_REQUEST.DEFAULT,
}) {}
