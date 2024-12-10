import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Authorization } from 'src/common/decorators/authorization.decorator';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import {
  AuthenticateRequest,
  AuthenticateUser,
} from 'src/common/interfaces/request.interface';
import { ControllerResponseData } from 'src/common/interfaces/response.interface';
import { TypedConfigService } from 'src/common/services/typed-config.service';
import {
  ForbiddenResponseDto,
  InternalServerErrorResponseDto,
} from 'src/common/validators/response.dto';
import { AuthenticationService } from './authentication.service';
import { AuthenticationResponseMessageEnum } from './enum/authentication.response.enum';
import { AuthenticationLoginQuery } from './validators/authentication.query.dto';
import { AuthenticateUserOkDto } from './validators/authentication.response.dto';

@Controller('authentication')
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly configService: TypedConfigService,
  ) {}

  @Get('login')
  @ApiOkResponse()
  @ApiOperation({
    operationId: 'authenticationLogin',
  })
  async login(
    @Query() query: AuthenticationLoginQuery,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    try {
      const accessTokenResult = await this.authenticationService.exchangeCode(
        query.code,
      );
      response.cookie('access_token', accessTokenResult.access_token);
    } catch {
      response.cookie('login_error', true);
    }

    response.redirect(
      HttpStatus.MOVED_PERMANENTLY,
      this.configService.get('discord.api.oauth2.frontendRedirectUri'),
    );
  }

  @Get('me')
  @Authorization({ secured: true })
  @ApiOkResponse({ type: AuthenticateUserOkDto })
  @ApiForbiddenResponse({ type: ForbiddenResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @ApiOperation({
    operationId: 'authenticationGetMe',
  })
  @ResponseMessage([
    { status: HttpStatus.OK, message: AuthenticationResponseMessageEnum.OK.ME },
  ])
  async getMe(
    @Req() request: AuthenticateRequest,
  ): Promise<ControllerResponseData<AuthenticateUser>> {
    return {
      result: {
        discord: request.auth.discord,
        riot: request.auth.riot,
      },
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
