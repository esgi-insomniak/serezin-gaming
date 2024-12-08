import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { XOR } from '../interfaces/utils.interface';

export type AuthorizationDecorator = XOR<
  { secured: boolean },
  { riotSecured: boolean }
>;
export const Authorization = (auth: AuthorizationDecorator) => {
  return applyDecorators(
    SetMetadata('secured', auth.secured),
    SetMetadata('riot-secured', auth.riotSecured),
    ApiBearerAuth('defaultBearerAuth'),
  );
};
