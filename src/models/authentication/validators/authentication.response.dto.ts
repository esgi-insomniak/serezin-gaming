import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  withBaseErrorResponse,
  withBaseResponse,
} from 'src/common/validators/response.dto';
import { AuthenticationResponseMessageEnum } from '../enum/authentication.response.enum';

const TournamentExample = {
  token_type: 'Bearer',
  access_token: 'iarr2WqxpBddFiOPSLl7VVEgtpNuCs',
  expires_in: 604800,
  refresh_token: 'XtO7WiKSmnH3YYuVDZMDduM5UrnB9E',
  scope: 'connections',
};

export class AuthenticationTokenDto {
  @ApiProperty()
  token_type: string;

  @ApiProperty()
  access_token: string;

  @ApiProperty()
  expires_in: number;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  scope: string;
}

export class AuthenticationExchangeCodeResponseDto extends withBaseResponse(
  AuthenticationTokenDto,
  {
    statusCode: HttpStatus.CREATED,
    message: AuthenticationResponseMessageEnum.CREATED.EXCHANGE_CODE,
  },
  {
    example: TournamentExample,
  },
) {}

export class AuthenticationExchangeCodeBadRequestResponseDto extends withBaseErrorResponse(
  {
    statusCode: HttpStatus.BAD_REQUEST,
    message: AuthenticationResponseMessageEnum.BAD_REQUEST.EXCHANGE_CODE,
  },
) {}
