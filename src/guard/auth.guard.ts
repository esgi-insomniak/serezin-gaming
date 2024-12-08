import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ResponseMessageDecorator } from 'src/common/decorators/response.decorator';
import { ResponseMessageEnum } from 'src/common/enum/response.enum';
import { AuthenticateRequest } from 'src/common/interfaces/request.interface';
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
    const riotSecured = this.reflector.get<boolean>(
      'riot-secured',
      context.getHandler(),
    );

    if (!secured && !riotSecured) return true;

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

    if (!bearerToken || !bearerToken.startsWith('Bearer '))
      throw FormatedForbiddenException;

    try {
      const authenticateUser =
        await this.authenticationService.getAuthenticateUser(bearerToken);

      // check if riot connection is enabled or throw exception
      if (riotSecured && !authenticateUser.riot)
        throw FormatedForbiddenException;

      context.switchToHttp().getRequest<AuthenticateRequest>().auth =
        authenticateUser;
    } catch (error: HttpException | unknown) {
      if (
        !(error instanceof HttpException) ||
        error.getStatus() >= HttpStatus.INTERNAL_SERVER_ERROR
      )
        throw new InternalServerErrorException();
      throw FormatedForbiddenException;
    }

    return true;
  }
}
