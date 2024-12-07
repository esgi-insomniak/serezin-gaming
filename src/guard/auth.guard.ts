import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ResponseMessageDecorator } from 'src/common/decorators/response.decorator';
import { ResponseMessageEnum } from 'src/common/enum/response.enum';
import { TypedConfigService } from 'src/common/services/typed-config.service';
import { AuthenticationService } from '../models/authentication/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: TypedConfigService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<boolean>(
      'secured',
      context.getHandler(),
    );

    if (!secured) return true;

    const FormatedForbiddenException = new ForbiddenException({
      statusCode: HttpStatus.FORBIDDEN,
      error: {
        message:
          this.reflector
            .get<ResponseMessageDecorator>(
              'response_message',
              context.getHandler(),
            )
            ?.filter((x) => x.status === HttpStatus.FORBIDDEN)[0]?.message ||
          ResponseMessageEnum.FORBIDDEN,
      },
    });

    const bearerToken = context.switchToHttp().getRequest<Request>()
      .headers.authorization;

    if (!bearerToken) throw FormatedForbiddenException;

    const authorizationInformations =
      await this.authenticationService.getAuthorizationInformations(
        bearerToken,
      );

    if (typeof authorizationInformations === 'boolean')
      throw FormatedForbiddenException;

    // verify if token is linked to the application
    if (
      authorizationInformations.application.id !==
      this.configService.get('discord.app.id')
    )
      throw FormatedForbiddenException;

    // TODO: verify if the scope is correct

    return true;
  }
}
