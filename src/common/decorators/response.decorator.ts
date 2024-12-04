import { HttpStatus, SetMetadata } from '@nestjs/common';

export type ResponseMessageDecorator = {
  status: HttpStatus;
  message: string;
}[];

export const ResponseMessage = (message: ResponseMessageDecorator) =>
  SetMetadata('response_message', message);
