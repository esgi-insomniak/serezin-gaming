import { Injectable } from '@nestjs/common';
import { PaginationMeta } from 'src/common/interfaces/metadata.interface';
import { QueryPagination } from 'src/common/interfaces/query.interface';
import { Repository } from 'typeorm';

export interface PaginateResponse<T> {
  result: T[];
  meta: PaginationMeta;
}

@Injectable()
export class PaginationService {
  async paginate<T>(
    repository: Repository<T>,
    query: QueryPagination,
  ): Promise<PaginateResponse<T>> {
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / query.itemsPerPage);

    query.page = query.page > totalPages ? totalPages : query.page;

    return {
      result: await repository.find({
        take: query.itemsPerPage,
        skip: (query.page - 1) * query.itemsPerPage,
        loadRelationIds: true,
      }),
      meta: {
        currentPage: query.page,
        totalPages,
        itemsPerPage: query.itemsPerPage,
        totalItems,
        haveNextPage: query.page < totalPages,
        havePreviousPage: query.page > 1,
      },
    };
  }
}
