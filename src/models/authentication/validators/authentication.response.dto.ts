import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { APIConnection, APIUser } from 'discord-api-types/v10';
import {
  withBaseErrorResponse,
  withBaseResponse,
} from 'src/common/validators/response.dto';
import { AuthenticationResponseMessageEnum } from '../enum/authentication.response.enum';

export const AuthenticateUserExample = {
  discord: {
    id: '123456789012345678',
    username: 'test',
    avatar: '12345678901234567890122345678912',
    global_name: 'Test',
  },
  riot: {
    id: '123456789012345678901234567890123456789012345678901234567890123456789012345678',
    name: 'Test#EUW',
  },
  token: {
    type: 'Bearer',
    access_token: 'EzaSJRlojeSh1FQ5YuIfOsJkr9RMxE',
  },
};

export class AuthenticateUserDto {
  @ApiProperty({
    required: true,
    properties: {
      id: { type: 'string', required: true },
      username: { type: 'string', required: true },
      avatar: { type: 'string', required: true },
      global_name: { type: 'string', nullable: true },
    },
  } as ApiPropertyOptions)
  discord: APIUser;

  @ApiProperty({
    nullable: true,
    properties: {
      id: { type: 'string', required: true },
      name: { type: 'string', required: true },
    },
  } as ApiPropertyOptions)
  riot: APIConnection;

  @ApiProperty({
    required: true,
    properties: {
      type: { type: 'string', required: true },
      access_token: { type: 'string', required: true },
    },
  } as ApiPropertyOptions)
  token: {
    type: string;
    access_token: string;
  };
}

export class AuthenticationExchangeCodeResponseDto extends withBaseResponse(
  AuthenticateUserDto,
  {
    statusCode: HttpStatus.CREATED,
    message: AuthenticationResponseMessageEnum.CREATED.EXCHANGE_CODE,
  },
  {
    example: AuthenticateUserExample,
  },
) {}

export class AuthenticationExchangeCodeBadRequestResponseDto extends withBaseErrorResponse(
  {
    statusCode: HttpStatus.BAD_REQUEST,
    message: AuthenticationResponseMessageEnum.BAD_REQUEST.EXCHANGE_CODE,
  },
) {}
