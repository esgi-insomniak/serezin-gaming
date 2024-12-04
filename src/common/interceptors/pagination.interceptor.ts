import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PaginationDecorator } from '../decorators/pagination.decorator';
import { QueryPagination } from '../interfaces/query.interface';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Response>> {
    const query = context.switchToHttp().getRequest().query as QueryPagination;
    const paginationOptions = this.reflector.get<PaginationDecorator>(
      'pagination',
      context.getHandler(),
    );

    if (!paginationOptions) return next.handle();

    query.itemsPerPage = query.itemsPerPage
      ? query.itemsPerPage > paginationOptions.maxItemsPerPage
        ? paginationOptions.maxItemsPerPage
        : query.itemsPerPage
      : paginationOptions.itemsPerPage;
    query.page = query.page || 1;

    return next.handle();
  }
}
