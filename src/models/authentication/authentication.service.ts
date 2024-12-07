import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';
import {
  OAuth2Routes,
  RESTGetAPIOAuth2CurrentAuthorizationResult,
  RESTPostOAuth2AccessTokenResult,
  RouteBases,
  Routes,
} from 'discord-api-types/v10';
import { firstValueFrom } from 'rxjs';
import { TypedConfigService } from 'src/common/services/typed-config.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly configService: TypedConfigService,
    private readonly httpService: HttpService,
  ) {}

  async exchangeCode(code: string): Promise<RESTPostOAuth2AccessTokenResult> {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: this.configService.get('discord.app.id'),
        password: this.configService.get('discord.app.secret'),
      },
    };
    const requestBody = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.configService.get('discord.api.oauth2.redirectUri'),
    };

    try {
      const { data }: { data: RESTPostOAuth2AccessTokenResult } =
        await firstValueFrom(
          this.httpService.post(OAuth2Routes.tokenURL, requestBody, config),
        );
      return data;
    } catch (error: AxiosError | unknown) {
      if (
        !(error instanceof AxiosError) ||
        error.response.status >= HttpStatus.INTERNAL_SERVER_ERROR
      )
        throw new InternalServerErrorException();
      throw new BadRequestException();
    }
  }

  async getAuthorizationInformations(
    bearerToken: string,
  ): Promise<boolean | RESTGetAPIOAuth2CurrentAuthorizationResult> {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: bearerToken,
      },
    };

    try {
      const { data }: { data: RESTGetAPIOAuth2CurrentAuthorizationResult } =
        await firstValueFrom(
          this.httpService.get(
            RouteBases.api + Routes.oauth2CurrentAuthorization(),
            config,
          ),
        );
      return data;
    } catch (error: AxiosError | unknown) {
      if (
        !(error instanceof AxiosError) ||
        error.response.status >= HttpStatus.INTERNAL_SERVER_ERROR
      )
        throw new InternalServerErrorException();
      return false;
    }
  }
}
