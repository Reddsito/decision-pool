import { Request } from 'express';

export type AuthPayload = {
  userID: string;
  pollID: string;
  name: string;
};

export type Payload = {
  pollID: string;
  name: string;
  sub: string;
  exp: number;
  iat: number;
};

export type RequestWithAuth = Request & AuthPayload;
