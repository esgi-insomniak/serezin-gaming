import { HttpStatus } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';

export interface ControllerResponseData<T, M = object> {
  result: T;
  message?: string;
  meta?: M;
}

export interface FormatedResponseBody<T, M> {
  statusCode: HttpStatus;
  message: string;
  data: T;
  meta: M | { [key: string]: any };
}

export interface FormatedErrorResponseBody {
  statusCode: HttpStatus;
  error: {
    message: string | string[];
  };
}
export interface Response<T> extends Omit<ExpressResponse, 'json' | 'status'> {
  status: (statusCode: HttpStatus) => Response<T>;
  json: (data: T) => void;
}
