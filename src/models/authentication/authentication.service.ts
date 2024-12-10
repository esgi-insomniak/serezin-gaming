import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';
import {
  ConnectionService,
  OAuth2Routes,
  RESTGetAPICurrentUserConnectionsResult,
  RESTGetAPIOAuth2CurrentAuthorizationResult,
  RESTPostOAuth2AccessTokenResult,
  RouteBases,
  Routes,
} from 'discord-api-types/v10';
import { firstValueFrom } from 'rxjs';
import { AuthenticateUser } from 'src/common/interfaces/request.interface';
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
      redirect_uri: this.configService.get(
        'discord.api.oauth2.backendRedirectUri',
      ),
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

  async getAuthenticateUser(bearerToken: string): Promise<AuthenticateUser> {
    try {
      const authorizationInformations =
        await this.getAuthorizationInformations(bearerToken);

      if (typeof authorizationInformations === 'boolean')
        throw new ForbiddenException();

      // verify if token is linked to the application
      if (
        authorizationInformations.application.id !==
        this.configService.get('discord.app.id')
      )
        throw new ForbiddenException();

      // check if application have right scopes permissions
      if (
        !this.configService
          .get('discord.app.scopes')
          .every((scope) => authorizationInformations.scopes.includes(scope))
      )
        throw new ForbiddenException();

      // add Riot/LoL connection to the request
      const riotConnection =
        (await this.getUserConnections(bearerToken)).find((connection) =>
          [
            ConnectionService.LeagueOfLegends,
            ConnectionService.RiotGames,
          ].includes(connection.type),
        ) || null;

      return {
        discord: {
          id: authorizationInformations.user.id,
          username: authorizationInformations.user.username,
          avatar: authorizationInformations.user.avatar,
          global_name: authorizationInformations.user.global_name,
        },
        riot: {
          id: riotConnection?.id,
          name: riotConnection?.name,
        },
      };
    } catch (error: HttpException | unknown) {
      if (
        !(error instanceof HttpException) ||
        error.getStatus() >= HttpStatus.INTERNAL_SERVER_ERROR
      )
        throw new InternalServerErrorException();
      throw new ForbiddenException();
    }
  }

  async getUserConnections(
    bearerToken: string,
  ): Promise<RESTGetAPICurrentUserConnectionsResult> {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: bearerToken,
        },
      };
      const { data }: { data: RESTGetAPICurrentUserConnectionsResult } =
        await firstValueFrom(
          this.httpService.get(
            RouteBases.api + Routes.userConnections(),
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
      throw new UnauthorizedException();
    }
  }

  async revokeAccessToken(accessToken: string): Promise<void> {
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
      token: accessToken,
      token_type_hint: 'access_token',
    };

    try {
      await firstValueFrom(
        this.httpService.post(
          OAuth2Routes.tokenRevocationURL,
          requestBody,
          config,
        ),
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
