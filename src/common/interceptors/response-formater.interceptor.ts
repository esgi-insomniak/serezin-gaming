import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { ResponseMessageDecorator } from '../decorators/response.decorator';

export interface Response<T, M> {
  statusCode: HttpStatus;
  message: string;
  data: T;
  meta: M | { [key: string]: any };
}

export interface ControllerResponseData<T, M = object> {
  result: T;
  message?: string;
  meta?: M;
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
        if (statusCode === HttpStatus.NO_CONTENT) return;
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
