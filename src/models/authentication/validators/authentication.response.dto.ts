import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { APIConnection, APIUser } from 'discord-api-types/v10';
import { withBaseResponse } from 'src/common/validators/response.dto';
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
}

export class AuthenticateUserOkDto extends withBaseResponse(
  AuthenticateUserDto,
  {
    statusCode: HttpStatus.OK,
    message: AuthenticationResponseMessageEnum.OK.ME,
  },
  {
    example: AuthenticateUserExample,
  },
) {}
