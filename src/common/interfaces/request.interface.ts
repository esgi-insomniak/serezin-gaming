import { APIConnection, APIUser } from 'discord-api-types/v10';
import { Request } from 'express';

export interface AuthenticateUser {
  discord: Pick<APIUser, 'id' | 'username' | 'avatar' | 'global_name'>;
  riot?: Pick<APIConnection, 'id' | 'name'>;
  token: {
    type: string;
    access_token: string;
  };
}

export interface AuthenticateRequest extends Request {
  auth: AuthenticateUser;
}
