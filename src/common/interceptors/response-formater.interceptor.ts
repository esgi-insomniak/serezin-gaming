import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable, tap } from 'rxjs';
import { ResponseMessageDecorator } from '../decorators/response.decorator';
import {
  ControllerResponseData,
  FormatedErrorResponseBody,
  FormatedResponseBody,
  Response,
} from '../interfaces/response.interface';

@Injectable()
export class ResponseFormaterInterceptor<T, M>
  implements NestInterceptor<T, FormatedResponseBody<T, M>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<FormatedResponseBody<T, M>> {
    return next.handle().pipe(
      map((data: ControllerResponseData<T, M>): FormatedResponseBody<T, M> => {
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
export class ExceptionFormaterInterceptor<T>
  implements NestInterceptor<T, void>
{
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
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
            .getResponse<Response<FormatedErrorResponseBody>>()
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
