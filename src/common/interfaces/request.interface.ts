import { APIConnection, APIUser } from 'discord-api-types/v10';
import { Request } from 'express';

export interface AuthenticateUser {
  user: APIUser;
  riot?: APIConnection;
  token: {
    type: string;
    access_token: string;
  };
}

export interface AuthenticateRequest extends Request {
  auth: AuthenticateUser;
}
