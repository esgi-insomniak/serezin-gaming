import { SetMetadata } from '@nestjs/common';

export type PaginationDecorator = {
  itemsPerPage: number;
  maxItemsPerPage: number;
};

export const Pagination = (pagination: PaginationDecorator) =>
  SetMetadata('pagination', pagination);
