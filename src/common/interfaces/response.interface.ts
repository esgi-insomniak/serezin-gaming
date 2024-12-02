import { HttpStatus } from '@nestjs/common';

export interface DefaultResponse {
  status: HttpStatus;
  message?: string;
}

export interface GetResponseArray<T> extends DefaultResponse {
  items: T[];
}

export interface GetResponseOne<T> extends DefaultResponse {
  item: T;
}
