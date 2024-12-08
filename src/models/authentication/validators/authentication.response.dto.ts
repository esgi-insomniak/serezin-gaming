import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { APIConnection, APIUser } from 'discord-api-types/v10';
import {
  withBaseErrorResponse,
  withBaseResponse,
} from 'src/common/validators/response.dto';
import { AuthenticationResponseMessageEnum } from '../enum/authentication.response.enum';

export const AuthenticateUserExample = {
  user: {
    id: '123456789012345678',
    username: 'test',
    avatar: '12345678901234567890122345678912',
    discriminator: '0',
    public_flags: 128,
    flags: 128,
    banner: null,
    accent_color: null,
    global_name: 'Test',
    avatar_decoration_data: null,
    banner_color: null,
    clan: null,
    primary_guild: null,
  },
  riot: {
    id: '123456789012345678901234567890123456789012345678901234567890123456789012345678',
    name: 'Test#EUW',
    type: 'leagueoflegends',
    friend_sync: false,
    metadata_visibility: 1,
    show_activity: true,
    two_way_link: false,
    verified: true,
    visibility: 1,
  },
  token: {
    type: 'Bearer',
    access_token: 'EzaSJRlojeSh1FQ5YuIfOsJkr9RMxE',
  },
};

export class AuthenticateUserDto {
  @ApiProperty({
    properties: {
      id: { type: 'string' },
      username: { type: 'string' },
      avatar: { type: 'string' },
      discriminator: { type: 'string' },
      public_flags: { type: 'number' },
      flags: { type: 'number' },
      banner: { type: 'string', nullable: true },
      accent_color: { type: 'number', nullable: true },
      global_name: { type: 'string', nullable: true },
      banner_color: { type: 'number', nullable: true },
      clan: { type: 'string', nullable: true },
      primary_guild: { type: 'string', nullable: true },
    },
  } as ApiPropertyOptions)
  user: APIUser;

  @ApiProperty({
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      type: { type: 'string' },
      friend_sync: { type: 'boolean' },
      metadata_visibility: { type: 'number' },
      show_activity: { type: 'boolean' },
      two_way_link: { type: 'boolean' },
      verified: { type: 'boolean' },
      visibility: { type: 'number' },
    },
  } as ApiPropertyOptions)
  riot: APIConnection;

  @ApiProperty({
    properties: {
      type: { type: 'string' },
      access_token: { type: 'string' },
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
