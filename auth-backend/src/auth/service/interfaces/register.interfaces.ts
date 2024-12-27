import { AuthResult } from './common.interfaces';

export interface RegistrationPayload {
  email: string;
  name: string;
  password: string;
}
export type RegistrationResult = AuthResult;
