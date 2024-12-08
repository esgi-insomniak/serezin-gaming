import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Authorization } from 'src/common/decorators/authorization.decorator';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import {
  AuthenticateRequest,
  AuthenticateUser,
} from 'src/common/interfaces/request.interface';
import { ControllerResponseData } from 'src/common/interfaces/response.interface';
import {
  ForbiddenResponseDto,
  InternalServerErrorResponseDto,
} from 'src/common/validators/response.dto';
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
  @ApiForbiddenResponse({ type: ForbiddenResponseDto })
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
  ): Promise<ControllerResponseData<AuthenticateUser>> {
    const accessTokenResult = await this.authenticationService.exchangeCode(
      params.code,
    );

    return {
      result: await this.authenticationService.getAuthenticateUser(
        accessTokenResult.token_type + ' ' + accessTokenResult.access_token,
      ),
    };
  }

  @Delete('revoke-token')
  @Authorization({ secured: true })
  @ApiNoContentResponse()
  @ApiForbiddenResponse({ type: ForbiddenResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    operationId: 'authenticationRevokeToken',
  })
  async revokeToken(
    @Req() request: AuthenticateRequest,
  ): Promise<ControllerResponseData<void>> {
    return {
      result: await this.authenticationService.revokeAccessToken(
        request.auth.token.access_token,
      ),
    };
  }
}
