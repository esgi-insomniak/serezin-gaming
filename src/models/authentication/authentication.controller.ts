import { Controller, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { ControllerResponseData } from 'src/common/interfaces/response.interface';
import { InternalServerErrorResponseDto } from 'src/common/validators/response.dto';
import { AuthenticationService } from './authentication.service';
import { AuthenticationResponseMessageEnum } from './enum/authentication.response.enum';
import { AuthenticationExchangeCodeParam } from './validators/authentication.params.dto';
import {
  AuthenticationExchangeCodeBadRequestResponseDto,
  AuthenticationExchangeCodeResponseDto,
} from './validators/authentication.response.dto';

@Controller('authentication')
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('exchange-code/:code')
  @ApiCreatedResponse({ type: AuthenticationExchangeCodeResponseDto })
  @ApiBadRequestResponse({
    type: AuthenticationExchangeCodeBadRequestResponseDto,
  })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @ResponseMessage([
    {
      status: HttpStatus.CREATED,
      message: AuthenticationResponseMessageEnum.CREATED.EXCHANGE_CODE,
    },
    {
      status: HttpStatus.BAD_REQUEST,
      message: AuthenticationResponseMessageEnum.BAD_REQUEST.EXCHANGE_CODE,
    },
  ])
  @ApiOperation({
    operationId: 'authenticationExchangeCode',
  })
  async exchangeCode(
    @Param() params: AuthenticationExchangeCodeParam,
  ): Promise<ControllerResponseData<RESTPostOAuth2AccessTokenResult>> {
    return {
      result: await this.authenticationService.exchangeCode(params.code),
    };
  }
}
