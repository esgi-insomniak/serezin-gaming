import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response as ExpressResponse } from 'express';
import { map, Observable, tap } from 'rxjs';
import { ResponseMessageDecorator } from '../decorators/response.decorator';

export interface ControllerResponseData<T, M = object> {
  result: T;
  message?: string;
  meta?: M;
}

export interface Response<T, M> {
  statusCode: HttpStatus;
  message: string;
  data: T;
  meta: M | { [key: string]: any };
}
export interface ErrorResponse
  extends Omit<ExpressResponse, 'json' | 'status'> {
  status: (statusCode: HttpStatus) => ErrorResponse;
  json: (data: {
    statusCode: HttpStatus;
    error: {
      message: string | string[];
    };
  }) => void;
}

@Injectable()
export class ResponseFormaterInterceptor<T, M>
  implements NestInterceptor<T, Response<T, M>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T, M>> {
    return next.handle().pipe(
      map((data: ControllerResponseData<T, M>): Response<T, M> => {
        const statusCode = context.switchToHttp().getResponse().statusCode;

        return {
          statusCode,
          message:
            data.message ||
            this.reflector
              .get<ResponseMessageDecorator>(
                'response_message',
                context.getHandler(),
              )
              ?.filter((x) => x.status === statusCode)[0]?.message ||
            '',
          data: data.result,
          meta: data.meta || {},
        };
      }),
    );
  }
}

@Injectable()
export class ExceptionFormaterInterceptor<T, M>
  implements NestInterceptor<T, Response<T, M>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T, M>> {
    return next.handle().pipe(
      tap({
        next: (): void => {},
        error: (exception: Error): void => {
          const statusCode =
            exception instanceof HttpException ? exception.getStatus() : 500;
          const errorMessage =
            this.reflector
              .get<ResponseMessageDecorator>(
                'response_message',
                context.getHandler(),
              )
              ?.filter((x) => x.status === statusCode)[0]?.message ||
            (exception instanceof HttpException
              ? (exception.getResponse() as object)['message']
              : 'Internal Server Error');

          // TODO: Setup Error Logger
          if (exception instanceof HttpException && statusCode >= 500)
            console.error(exception);

          context
            .switchToHttp()
            .getResponse<ErrorResponse>()
            .status(statusCode)
            .json({
              statusCode,
              error: {
                message: errorMessage,
              },
            });
        },
      }),
    );
  }
}
