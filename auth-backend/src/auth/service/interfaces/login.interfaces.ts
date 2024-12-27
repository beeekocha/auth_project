import { AuthResult } from './common.interfaces';

export interface LoginPayload {
  email: string;
  password: string;
}

export type LoginResult = AuthResult;
